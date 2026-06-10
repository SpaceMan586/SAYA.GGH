"use client";

import { useEffect, useState } from "react";
import { HiLockClosed, HiMail, HiShieldCheck } from "react-icons/hi";
import { supabase } from "@/lib/supabase";

const syncAdminSessionCookies = async () => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.access_token || !session.refresh_token) return;

  await fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    }),
  }).catch(() => {});
};

export default function AccountSettingsTab() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted || error || !data.user?.email) return;

      setCurrentEmail(data.user.email);
      setEmail(data.user.email);
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const nextEmail = email.trim();
    const isEmailChanged = nextEmail && nextEmail !== currentEmail;
    const isPasswordChanged = newPassword.length > 0 || confirmPassword.length > 0;

    if (!isEmailChanged && !isPasswordChanged) {
      setErrorMessage("Tidak ada perubahan yang disimpan.");
      return;
    }

    if (!currentEmail) {
      setErrorMessage("Session admin belum siap. Refresh halaman lalu coba lagi.");
      return;
    }

    if (!currentPassword) {
      setErrorMessage("Masukkan password lama untuk konfirmasi.");
      return;
    }

    if (isEmailChanged && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setErrorMessage("Format email baru belum valid.");
      return;
    }

    if (isPasswordChanged) {
      if (newPassword.length < 8) {
        setErrorMessage("Password baru minimal 8 karakter.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage("Konfirmasi password baru belum sama.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: currentPassword,
      });

      if (signInError) {
        setErrorMessage("Password lama salah atau session admin tidak valid.");
        return;
      }

      if (isEmailChanged) {
        const { error } = await supabase.auth.updateUser({ email: nextEmail });
        if (error) throw error;
      }

      if (isPasswordChanged) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;
      }

      await syncAdminSessionCookies();

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage(
        isEmailChanged
          ? "Perubahan tersimpan. Jika Supabase meminta konfirmasi email, cek inbox email baru."
          : "Password admin berhasil diganti.",
      );

      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setCurrentEmail(data.user.email);
        setEmail(data.user.email);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan akun admin.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl animate-in fade-in">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
          Security
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Account Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Update email login dan password untuk halaman admin.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
            >
              <HiMail className="h-5 w-5 text-gray-400" />
              Email Login
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
              placeholder="admin@example.com"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="current-password"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <HiShieldCheck className="h-5 w-5 text-gray-400" />
                Password Lama
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                placeholder="Masukkan password lama"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <HiLockClosed className="h-5 w-5 text-gray-400" />
                Password Baru
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Konfirmasi Password Baru
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
                placeholder="Ulangi password baru"
                autoComplete="new-password"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMessage}
            </p>
          )}

          {message && (
            <p className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {message}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
