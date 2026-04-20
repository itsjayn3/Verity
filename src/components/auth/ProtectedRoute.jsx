import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ProtectedRoute({ children, checkProfile = false }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [hasProfile, setHasProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sess = data.session;
      setSession(sess);

      if (sess && checkProfile) {
        // check if profile exists
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", sess.user.id)
          .single();

        setHasProfile(!!profile);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setHasProfile(null); // reset profile check on change
    });

    return () => listener.subscription.unsubscribe();
  }, [checkProfile]);

  if (session === undefined || (checkProfile && hasProfile === null))
    return <p className="text-white">Loading...</p>;

  if (!session) return <Navigate to="/auth" replace />;

  if (checkProfile && !hasProfile) return <Navigate to="/complete-profile" replace />;

  return children;
}