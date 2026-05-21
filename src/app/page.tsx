"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

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
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/my-bookings"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                My Bookings
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4 text-center">
          Book Your Flights Easily ✈️
        </h2>

        <p className="text-gray-600 text-lg mb-8 text-center">
          Search flights, choose seats, and manage bookings seamlessly.
        </p>

        <Link
          href="/booking"
          className="bg-black text-white px-8 py-4 rounded-xl text-lg hover:bg-gray-800 transition"
        >
          Search Flights
        </Link>
      </div>
    </div>
  );
}