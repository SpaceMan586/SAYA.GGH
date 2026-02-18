// app/rls-test/page.tsx
import RlsTestForm from './RlsTestForm';

export default function RlsTestPage() {
  return (
    <main style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontFamily: 'sans-serif', color: '#333' }}>
        Supabase RLS Login & Insert Test
      </h1>
      <RlsTestForm />
    </main>
  );
}
