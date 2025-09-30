import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Client-side Validation
  const validate = () => {
    const newErrors = {};

    if (!form.name) {
      newErrors.name = "Name is required";
    } else if (form.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (form.name[0] !== form.name[0].toUpperCase()) {
      newErrors.name = "First letter must be uppercase";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must contain an uppercase letter";
    }

    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Something went wrong";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-orange-900 p-6">
      <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
          Create Account
        </h2>

        <form onSubmit={submit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-400 border border-orange-500/30 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-400 border border-orange-500/30 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-400 border border-orange-500/30 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="text-red-400 text-sm">{serverError}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-500 text-black font-semibold shadow-lg hover:shadow-orange-500/50 transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* ✅ Already have account link */}
        <p className="mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
