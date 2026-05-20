"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";

interface Booking {
  id: string;
  status: string;
  total_price: number;
  pnr_code: string;

  flights: {
    id: string;
    flight_no: string;
    origin: string;
    destination: string;
  };

  seats: {
    seat_number: string;
  };
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        flights (
          id,
          flight_no,
          origin,
          destination
        ),
        seats (
          seat_number
        )
      `)
      .eq("user_id", user.id);

    if (!error && data) {
      setBookings(data as any);
    }

    setLoading(false);
  }

  async function cancelBooking(
  bookingId: string
) {
  const confirmCancel = confirm(
    "Are you sure you want to cancel?"
  );

  if (!confirmCancel) return;

  const { data, error } = await supabase.rpc(
    "cancel_booking",
    {
      p_booking_id: bookingId,
    }
  );

  if (error) {
    alert(error.message);

    return;
  }

  if (data) {
    fetchBookings();
  }
}
  async function rescheduleBooking(
    bookingId: string,
    currentOrigin: string,
    currentDestination: string
  ) {
    const { data: flights } = await supabase
      .from("flights")
      .select("*")
      .eq("origin", currentOrigin)
      .eq(
        "destination",
        currentDestination
      );

    if (!flights || flights.length === 0) {
      alert("No alternative flights found");

      return;
    }

    const selectedFlightId = prompt(
      flights
        .map(
          (f) =>
            `${f.flight_no} - ${f.id}`
        )
        .join("\n\n")
    );

    if (!selectedFlightId) return;

    const booking = bookings.find(
      (b) => b.id === bookingId
    );

    if (!booking) return;

    // Insert reschedule record

    await supabase.from("reschedules").insert([
      {
        booking_id: bookingId,
        old_flight_id:
          booking.flights?.id,
        new_flight_id:
          selectedFlightId,
        fee_charged: 1000,
      },
    ]);

    // Update booking

    const { error } = await supabase
      .from("bookings")
      .update({
        flight_id: selectedFlightId,
        status: "rescheduled",
      })
      .eq("id", bookingId);

    if (!error) {
      fetchBookings();
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8">
        My Bookings ✈️
      </h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {
                      booking.flights
                        ?.flight_no
                    }
                  </h2>

                  <p className="mt-2">
                    {
                      booking.flights
                        ?.origin
                    }{" "}
                    →{" "}
                    {
                      booking.flights
                        ?.destination
                    }
                  </p>

                  <p className="mt-2">
                    Seat:{" "}
                    {
                      booking.seats
                        ?.seat_number
                    }
                  </p>

                  <p className="mt-2">
                    PNR:{" "}
                    <span className="font-bold">
                      {booking.pnr_code}
                    </span>
                  </p>

                  <p className="mt-2">
                    ₹ {booking.total_price}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`
                      px-4 py-2 rounded-full text-white text-sm

                      ${
                        booking.status ===
                        "cancelled"
                          ? "bg-red-500"
                          : booking.status ===
                            "rescheduled"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }
                    `}
                  >
                    {booking.status}
                  </span>

                  {booking.status !==
                    "cancelled" && (
                    <>
                      <button
                        onClick={() =>
                          rescheduleBooking(
                            booking.id,
                            booking.flights
                              ?.origin,
                            booking.flights
                              ?.destination
                          )
                        }
                        className="block mb-3 mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl"
                      >
                        Reschedule
                      </button>

                      <button
                        onClick={() =>
                          cancelBooking(
                            booking.id
                          )
                        }
                        className="block bg-black text-white px-4 py-2 rounded-xl"
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}