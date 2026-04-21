import { Navigate } from "react-router-dom";

// Session is managed at App level and passed as a prop
// This prevents remount redirects when navigating between protected routes
export default function ProtectedRoute({ children, session }) {
  if (!session) return <Navigate to="/auth" replace />;
  return children;
}