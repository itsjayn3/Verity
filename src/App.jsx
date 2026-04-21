import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import CompleteProfile from "./pages/CompleteProfile";
import ServicesPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LeaveReview from "./pages/LeaveReview";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = still loading

  useEffect(() => {
    // Get session once on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    // Keep session in sync across the whole app
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sess) => {
        setSession(sess ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Show loading spinner while session is being determined — only once on app load
  if (session === undefined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Complete profile */}
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute session={session}>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        {/* Services / Campus Feed */}
        <Route
          path="/services"
          element={
            <ProtectedRoute session={session}>
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        {/* Profile view */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute session={session}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Leave a review */}
        <Route
          path="/review/:userId"
          element={
            <ProtectedRoute session={session}>
              <LeaveReview />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}