import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import CompleteProfile from "./pages/CompleteProfile";
import ServicesPage from "./pages/SearchPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
       <Route path="/" element={<LandingPage />} />

        {/* Auth page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Complete profile page (protected) */}
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        {/* Services page (protected) */}
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        {/* profile page */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
            }
          />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}