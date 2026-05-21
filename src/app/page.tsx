"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase/client";
import { useFlightStore } from "@/store/useFlightStore";

export default function HomePage() {
  const router = useRouter();

  const { setSelectedFlight } = useFlightStore();

  const [user, setUser] = useState<any>(null);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [flights, setFlights] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setUser(session?.user || null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // SEARCH FLIGHTS

  const searchFlights = async () => {
    let query = supabase
      .from("flights")
      .select("*");

    if (source) {
      query = query.ilike(
        "origin",
        `%${source}%`
      );
    }

    if (destination) {
      query = query.ilike(
        "destination",
        `%${destination}%`
      );
    }

    const { data, error } = await query;

    if (!error && data) {
      setFlights(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}

      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Flight Management ✈️
        </h1>

        <div className="flex gap-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/my-bookings"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg"
              >
                My Bookings
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}

      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Book Your Flights Easily ✈️
        </h2>

        <p className="text-center text-gray-600 mb-10">
          Search flights, choose seats, and manage bookings seamlessly.
        </p>

        {/* Search Box */}

        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Source City"
              value={source}
              onChange={(e) =>
                setSource(e.target.value)
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Destination City"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
              className="border p-3 rounded-xl"
            />

            <button
              onClick={searchFlights}
              className="bg-black text-white rounded-xl"
            >
              Search Flights
            </button>
          </div>
        </div>

        {/* Flights */}

        <div className="grid md:grid-cols-2 gap-6">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white p-6 rounded-2xl shadow"
            >
              <h3 className="text-2xl font-bold">
                {flight.flight_no}
              </h3>

              <p className="mt-2 text-lg">
                {flight.origin} →{" "}
                {flight.destination}
              </p>

              <p className="mt-2">
                Price: ₹{flight.base_price}
              </p>

              <button
                onClick={() => {
                  setSelectedFlight(flight);
                  router.push("/seats");
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl"
              >
                Select Seats
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}