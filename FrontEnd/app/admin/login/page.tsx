"use client";

import { Button, Card, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;
    if (!accessToken || !refreshToken) {
      setErrorMessage("Missing session token after login");
      setIsSubmitting(false);
      return;
    }

    const sessionCookieResponse = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
    });
    if (!sessionCookieResponse.ok) {
      setErrorMessage("Failed to establish secure admin session");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="text-gray-500 text-sm mt-1">SAYA.GGH Dashboard</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Your email</Label>
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password">Your password</Label>
            </div>
            <TextInput
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}

          <Button
            type="submit"
            className="mt-4"
            color="dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In to Dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
