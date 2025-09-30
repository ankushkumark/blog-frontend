import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);

      setIsAuth(true);         
      navigate("/dashboard");     // ✅ Redirect to dashboard
    } catch (err) {
      setErrors(err.response?.data?.errors || [{ msg: "Invalid credentials" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Background animated circles */}
      <div className="absolute w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000 top-20 right-10"></div>
      <div className="absolute w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000 bottom-10 left-1/3"></div>

      {/* Card */}
      <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-6 
          bg-gradient-to-r from-purple-900 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
          Welcome to Blog Platform ✨
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-white/40 bg-white/40 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                         transition placeholder-gray-600"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-white/40 bg-white/40 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                         transition placeholder-gray-600"
            />
          </div>

          {errors.length > 0 && (
            <div className="text-sm text-red-600">
              {errors.map((e, i) => (
                <p key={i}>{e.msg}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 
                       text-white font-semibold rounded-lg shadow-lg 
                       hover:scale-105 active:scale-95 transition-transform 
                       relative overflow-hidden group"
          >
            <span className="relative z-10">
              {loading ? "Logging in..." : "Login"}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-500 
                             opacity-0 group-hover:opacity-100 blur-xl transition duration-500"></span>
          </button>
        </form>

        {/* Continue with Google */}
        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-3 py-3 
                             border border-white/50 rounded-lg shadow-md 
                             bg-white/60 backdrop-blur hover:bg-white transition">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>

        {/* Signup redirect */}
        <p className="mt-6 text-center text-gray-100 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
