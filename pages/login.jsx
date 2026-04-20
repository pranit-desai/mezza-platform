import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.query.error === 'domain') {
      setError('Access restricted to @mezzapay.com and @mezzaapp.com accounts.');
    }
  }, [router.query.error]);

  const signIn = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  return (
    <div style={{ background: '#161616', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ background: '#1e1e1e', border: '2px solid rgba(255,107,53,.2)', borderRadius: 20, padding: '48px 40px', width: 360, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#ff6b35,#ff8e53)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>M</div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: 3, color: '#ff6b35' }}>MEZZA</span>
        </div>
        <div style={{ fontSize: 14, color: '#888078', marginBottom: 32, lineHeight: 1.6 }}>
          Credit intelligence for F&amp;B underwriting.<br />
          Sign in with your Mezza Google account.
        </div>
        {error && (
          <div style={{ background: 'rgba(212,48,48,.1)', border: '1px solid rgba(212,48,48,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#d43030' }}>
            {error}
          </div>
        )}
        <button
          onClick={signIn}
          disabled={loading}
          style={{ width: '100%', padding: '13px 20px', borderRadius: 10, border: '1px solid rgba(255,107,53,.4)', background: loading ? 'rgba(255,107,53,.05)' : 'rgba(255,107,53,.1)', color: loading ? '#888078' : '#ff6b35', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>
        <div style={{ fontSize: 11, color: '#555', marginTop: 20 }}>
          Only @mezzapay.com and @mezzaapp.com
        </div>
      </div>
    </div>
  );
}
