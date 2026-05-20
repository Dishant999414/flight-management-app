"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();

  const pnr = searchParams.get("pnr");

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow p-10 max-w-xl w-full text-center">
        <h1 className="text-5xl mb-6">
          🎉
        </h1>

        <h2 className="text-4xl font-bold mb-4">
          Booking Confirmed
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          Your flight booking has been successfully completed.
        </p>

        <div className="bg-gray-100 rounded-xl p-6 mb-6">
          <p className="text-gray-500 mb-2">
            PNR Code
          </p>

          <p className="text-3xl font-bold tracking-widest">
            {pnr}
          </p>
        </div>

        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-xl"
        >
          Back To Home
        </Link>
      </div>
    </main>
  );
}