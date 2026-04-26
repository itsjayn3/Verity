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
import ProfileSettings from "./pages/ProfileSettings";
import PostService from "./pages/PostService";
import Footer from "./components/layout/Footer";
import AboutPage from "./pages/AboutPage";
import FAQsPage from "./pages/FAQsPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const [session, setSession] = useState(undefined); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    // session in sync across the whole site
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sess) => {
        setSession(sess ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // show loading spinner while waiting 
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
        {/* public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/settings" element={
          <ProtectedRoute session={session}>
            <ProfileSettings />
          </ProtectedRoute>
        } />

        <Route path="/post-service" element={
          <ProtectedRoute session={session}>
            <PostService />
          </ProtectedRoute>
        } />
        
        {/* CompleteProfile */}
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute session={session}>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        {/* CampusFeed */}
        <Route
          path="/services"
          element={
            <ProtectedRoute session={session}>
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        {/* ProfileView */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute session={session}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* leaving a review */}
        <Route
          path="/review/:userId"
          element={
            <ProtectedRoute session={session}>
              <LeaveReview />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
       <Footer /> 
    </BrowserRouter>
  );
}