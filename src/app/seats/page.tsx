"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { useFlightStore } from "@/store/useFlightStore";

interface Seat {
  id: string;
  seat_number: string;
  class: string;
  is_available: boolean;
  extra_fee: number;
}

export default function SeatsPage() {
  const router = useRouter();

  const {
    selectedFlight,
    selectedSeat,
    setSelectedFlight,
    setSelectedSeat,
  } = useFlightStore();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  // Load default flight if none selected
  useEffect(() => {
    async function loadDefaultFlight() {
      if (!selectedFlight) {
        const { data } = await supabase
          .from("flights")
          .select("*")
          .limit(1)
          .single();

        if (data) {
          setSelectedFlight(data);
        }
      }
    }

    loadDefaultFlight();
  }, [selectedFlight, setSelectedFlight]);

  // Fetch seats
  useEffect(() => {
    if (selectedFlight) {
      fetchSeats();

      const channel = supabase
        .channel("seats-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "seats",
          },
          () => {
            fetchSeats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedFlight]);

  async function fetchSeats() {
    if (!selectedFlight) return;

    const { data, error } = await supabase
      .from("seats")
      .select("*")
      .eq("flight_id", selectedFlight.id);

    if (!error && data) {
      setSeats(data);
    }

    setLoading(false);
  }

  // Prevent flashing error while loading
  if (!selectedFlight && !loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          No Flight Selected
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8">
        Select Your Seat ✈️
      </h1>

      {/* Flight Info */}

      {selectedFlight && (
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold">
            {selectedFlight.flight_no}
          </h2>

          <p className="mt-2 text-lg">
            {selectedFlight.origin} →{" "}
            {selectedFlight.destination}
          </p>
        </div>
      )}

      {/* Legend */}

      <div className="flex gap-6 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded"></div>
          <span>Occupied</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Seats */}

      {loading ? (
        <p>Loading seats...</p>
      ) : (
        <>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl">
            {seats.map((seat) => {
              const isSelected =
                selectedSeat?.id === seat.id;

              return (
                <button
                  key={seat.id}
                  disabled={!seat.is_available}
                  onClick={() => setSelectedSeat(seat)}
                  className={`
                    p-4 rounded-xl text-white font-bold transition

                    ${
                      isSelected
                        ? "bg-blue-500"
                        : seat.is_available
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 cursor-not-allowed"
                    }
                  `}
                >
                  {seat.seat_number}
                </button>
              );
            })}
          </div>

          {selectedSeat && (
            <button
              onClick={() => router.push("/booking")}
              className="mt-8 bg-black text-white px-8 py-3 rounded-xl"
            >
              Continue Booking
            </button>
          )}
        </>
      )}
    </main>
  );
}