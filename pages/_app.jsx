import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

const ALLOWED_DOMAINS = ['mezzapay.com', 'mezzaapp.com'];

function domainAllowed(email) {
  if (!email) return false;
  return ALLOWED_DOMAINS.includes(email.split('@')[1]);
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !domainAllowed(session.user?.email)) {
        supabase.auth.signOut().then(() => {
          setSession(null);
          setChecking(false);
          router.push('/login?error=domain');
        });
      } else {
        setSession(session);
        setChecking(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !domainAllowed(session.user?.email)) {
        supabase.auth.signOut().then(() => {
          setSession(null);
          router.push('/login?error=domain');
        });
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!checking && !session && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [checking, session, router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (checking) {
    return (
      <div style={{ background: '#161616', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ color: '#555', fontSize: 13, letterSpacing: 1 }}>LOADING…</div>
      </div>
    );
  }

  if (!session && router.pathname !== '/login') return null;

  return <Component {...pageProps} />;
}
