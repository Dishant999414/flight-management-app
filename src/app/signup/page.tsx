"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Signup</h1>

      <input
        className="border p-2 rounded"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 rounded"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Signup
      </button>
    </main>
  );
}