"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDebugInsert() {
  const [email, setEmail] = useState("admin@saya.ggh");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState("");

  const handleLogin = async () => {
    setLog("Logging in...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLog(`Login error: ${error.message}`);
      return;
    }

    setLog(`Login OK. user=${data.user?.id}`);
  };

  const handleInsert = async () => {
    setLog("Checking session...");
    const { data: sessionData } = await supabase.auth.getSession();
    const { data: userData } = await supabase.auth.getUser();

    console.log("getSession:", sessionData);
    console.log("getUser:", userData);

    if (!sessionData.session || !userData.user) {
      setLog("No session/user. Abort insert.");
      return;
    }

    setLog("Inserting project...");
    const { error } = await supabase.from("projects").insert([
      {
        title: "Project Baru",
        description: "Tidak kena RLS lagi",
        images: { desktop: "/img/a.jpg" },
      },
    ]);

    if (error) {
      setLog(`Insert error (RLS?): ${error.message}`);
      console.error("Insert error detail:", error);
      return;
    }

    setLog("Insert success!");
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6 md:px-10">
      <div className="max-w-xl space-y-4">
        <h1 className="text-xl font-bold">Admin Debug Insert</h1>
        <input
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          className="border p-2 w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <div className="flex gap-2">
          <button className="border px-3 py-2" onClick={handleLogin}>
            Login
          </button>
          <button className="border px-3 py-2" onClick={handleInsert}>
            Insert
          </button>
        </div>
        <pre className="bg-gray-100 p-2 text-sm whitespace-pre-wrap">
          {log}
        </pre>
      </div>
    </div>
  );
}
