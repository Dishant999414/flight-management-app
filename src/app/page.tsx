"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { useFlightStore } from "@/store/useFlightStore";

interface Flight {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  aircraft_type: string;
  base_price: number;
}

export default function Home() {
  const router = useRouter();

  const { setSelectedFlight } = useFlightStore();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlights();
  }, []);

  async function fetchFlights() {
    const { data, error } = await supabase
      .from("flights")
      .select("*");

    if (!error && data) {
      setFlights(data);
      setFilteredFlights(data);
    }

    setLoading(false);
  }

  function handleSearch() {
    const filtered = flights.filter((flight) => {
      return (
        flight.origin
          .toLowerCase()
          .includes(origin.toLowerCase()) &&
        flight.destination
          .toLowerCase()
          .includes(destination.toLowerCase())
      );
    });

    setFilteredFlights(filtered);
  }

  function handleBookFlight(flight: Flight) {
    setSelectedFlight(flight);

    router.push("/seats");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Flight Management ✈️
      </h1>

      {/* Search Box */}

      <div className="bg-white p-6 rounded-2xl shadow mb-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <button
            onClick={handleSearch}
            className="bg-black text-white rounded-xl"
          >
            Search Flights
          </button>
        </div>
      </div>

      {/* Flights */}

      {loading ? (
        <p className="text-center">Loading flights...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h2 className="text-2xl font-bold mb-2">
                {flight.flight_no}
              </h2>

              <p className="text-lg">
                {flight.origin} → {flight.destination}
              </p>

              <p className="text-gray-500 mt-2">
                {flight.aircraft_type}
              </p>

              <p className="text-2xl font-bold mt-4">
                ₹ {flight.base_price}
              </p>

              <button
                onClick={() => handleBookFlight(flight)}
                className="mt-5 w-full bg-black text-white py-2 rounded-xl"
              >
                Book Flight
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}