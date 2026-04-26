import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, session }) {
  if (!session) return <Navigate to="/auth" replace />;
  return children;
}