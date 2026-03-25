import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import WarehouseTracker from "./pages/WarehouseTracker";
import SenderPortal from "./pages/SenderPortal";
import ReceiverPortal from "./pages/ReceiverPortal";
import { useAuth } from "./hooks/useAuth";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const hasRequiredRole =
      user.role === "admin" || allowedRoles.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="warehouse" element={<WarehouseTracker />} />
          <Route
            path="sender"
            element={
              <ProtectedRoute allowedRoles={["sender", "admin"]}>
                <SenderPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="receiver"
            element={
              <ProtectedRoute allowedRoles={["receiver", "admin"]}>
                <ReceiverPortal />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
