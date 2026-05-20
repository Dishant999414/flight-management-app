"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { useFlightStore } from "@/store/useFlightStore";

export default function BookingPage() {
  const router = useRouter();

  const {
    selectedFlight,
    selectedSeat,
    resetBooking,
  } = useFlightStore();

  const [fullName, setFullName] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [dob, setDob] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleBooking() {
    if (!selectedFlight || !selectedSeat) {
      alert("Missing flight or seat");
      return;
    }

    setLoading(true);

    // Get Logged User

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    // Reserve Seat RPC

    const { data: seatReserved } = await supabase.rpc(
      "reserve_seat",
      {
        p_seat_id: selectedSeat.id,
      }
    );

    if (!seatReserved) {
      alert("Seat already booked");
      return;
    }

    // Generate PNR

    const pnr =
      "PNR" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    // Create Booking

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          flight_id: selectedFlight.id,
          seat_id: selectedSeat.id,
          total_price:
            selectedFlight.base_price +
            selectedSeat.extra_fee,
          pnr_code: pnr,
        },
      ])
      .select()
      .single();

    if (error || !booking) {
  console.log(error);

  alert(error?.message || "Booking failed");

  setLoading(false);

  return;
}

    // Passenger Insert

    await supabase.from("passengers").insert([
      {
        booking_id: booking.id,
        full_name: fullName,
        passport_no: passportNo,
        nationality,
        dob,
      },
    ]);

    resetBooking();

    router.push(`/confirmation?pnr=${pnr}`);
  }

  if (!selectedFlight || !selectedSeat) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Missing Booking Details
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-4xl font-bold mb-8">
          Passenger Details ✈️
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Passport Number"
            value={passportNo}
            onChange={(e) => setPassportNo(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <div className="bg-gray-100 p-4 rounded-xl">
            <p>
              Flight: {selectedFlight.flight_no}
            </p>

            <p>
              Seat: {selectedSeat.seat_number}
            </p>

            <p className="font-bold mt-2">
              Total: ₹
              {selectedFlight.base_price +
                selectedSeat.extra_fee}
            </p>
          </div>

          <button
            disabled={loading}
            onClick={handleBooking}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {loading
              ? "Booking..."
              : "Confirm Booking"}
          </button>
        </div>
      </div>
    </main>
  );
}