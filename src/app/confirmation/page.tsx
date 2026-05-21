"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const pnr = searchParams.get("pnr");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Booking Confirmed ✈️
        </h1>

        <p className="text-gray-700 mb-2">
          Your booking has been successfully completed.
        </p>

        <p className="text-lg font-semibold mb-6">
          PNR: <span className="text-blue-600">{pnr}</span>
        </p>

        <Link
          href="/my-bookings"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}