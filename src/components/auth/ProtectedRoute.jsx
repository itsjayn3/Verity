import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ProtectedRoute({ children, checkProfile = false }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [hasProfile, setHasProfile] = useState(null);

  useEffect(() => {
    // Handle email confirmation redirect — Supabase puts token in URL hash
    // onAuthStateChange picks this up before getSession does
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);

      if (sess && checkProfile) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", sess.user.id)
          .single();
        setHasProfile(!!profile);
      } else if (!sess) {
        setHasProfile(null);
      }
    });

    // Also check existing session on mount
    supabase.auth.getSession().then(async ({ data }) => {
      const sess = data.session;

      // Only set if onAuthStateChange hasn't already set it
      setSession(prev => prev === undefined ? sess : prev);

      if (sess && checkProfile) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", sess.user.id)
          .single();
        setHasProfile(!!profile);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [checkProfile]);

  // Still loading
  if (session === undefined || (checkProfile && hasProfile === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;

  if (checkProfile && !hasProfile) return <Navigate to="/complete-profile" replace />;

  return children;
}