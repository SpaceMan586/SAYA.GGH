// app/rls-test/RlsTestForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RlsTestForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  // LOGGING: Cek sesi saat komponen pertama kali dimuat
  useEffect(() => {
    const checkInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Initial session check on component mount:', data.session);
    };
    checkInitialSession();
  }, []);

  const handleLoginAndInsert = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    console.clear(); // Bersihkan konsol untuk debugging yang bersih

    try {
      // --- LANGKAH 1: PROSES SIGN IN ---
      console.log('--- Step 1: Attempting to sign in... ---');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Ini akan menangani error seperti 'Invalid login credentials'
        throw new Error(`Sign-in process failed: ${signInError.message}`);
      }
      console.log('✅ Step 1 SUCCESS: signInWithPassword call was successful.', signInData);

      // --- LANGKAH 2: VERIFIKASI SESI SETELAH LOGIN ---
      console.log('--- Step 2: Verifying session immediately after sign-in... ---');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(`Failed to get session post-login: ${sessionError.message}`);
      }
      if (!sessionData.session) {
        // INI ADALAH TITIK KRITIS. Jika session null, autentikasi gagal.
        throw new Error('CRITICAL: Session is NULL after a successful sign-in call. Auth failed.');
      }
      
      console.log('✅ Step 2 SUCCESS: getSession() returned a valid session.', sessionData.session);
      
      // Verifikasi tambahan dengan getUser() untuk memastikan
      const { data: userData } = await supabase.auth.getUser();
      console.log('✅ Additional check with getUser():', userData.user);

      // --- LANGKAH 3: LAKUKAN INSERT JIKA SESI VALID ---
      console.log('--- Step 3: Session confirmed. Attempting to INSERT into projects... ---');
      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          title: "Project Baru dari Next.js (FIXED)",
          description: "Sesi terverifikasi sebelum insert!"
        });

      if (insertError) {
        // Jika masih error di sini, kemungkinan besar bukan karena auth, tapi RLS/DB lain.
        // Tapi jika Anda mendapatkan 401, berarti session tiba-tiba hilang.
        throw new Error(`Insert failed (RLS or DB error): ${insertError.message}`);
      }

      console.log('✅ Step 3 SUCCESS: Insert operation completed.');
      setMessage({ type: 'success', text: 'Login & Insert successful! Session was verified.' });

    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ PROCESS FAILED:', error);
        setMessage({ type: 'error', text: error.message });
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    // JSX-nya sama seperti sebelumnya, tidak perlu diubah
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLoginAndInsert}>
        {/* ... form inputs ... */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}>
          {loading ? 'Processing...' : 'Login and Insert Project'}
        </button>
      </form>
      {message && (
        <p style={{ marginTop: '20px', padding: '10px', backgroundColor: message.type === 'error' ? '#ffebeb' : '#ebf8e6', border: `1px solid ${message.type === 'error' ? '#e57373' : '#81c784'}`, borderRadius: '4px', color: message.type === 'error' ? '#c62828' : '#388e3c', fontWeight: 'bold' }}>
          {message.text}
        </p>
      )}
    </div>
  )
}
