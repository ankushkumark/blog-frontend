import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Footer from "./components/Footer";
import PostDetails from "./pages/PostDetails";

// 🔒 PrivateRoute
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => setIsAuth(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
          />

          {/* Auth pages */}
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/register" element={<Register setIsAuth={setIsAuth} />} />

          {/* Dashboard (protected) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Create Post (protected) */}
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          {/* Post Details (protected) */}
          <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
                <PostDetails />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {/* Footer har page par dikhna chahiye */}
      <Footer />
    </div>
  );
}
