import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => setImage(e.target.files[0]);

  // ✅ Upload to Cloudinary
  const uploadImage = async () => {
    if (!image) return null;
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD
      }/image/upload`,
      { method: "POST", body: data }
    );
    const file = await res.json();
    return file.secure_url; // ✅ final image URL
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
      }

      await api.post("/posts", {
        title: form.title,
        content: form.content,
        image: imageUrl,
      });

      navigate("/dashboard");
    } catch (err) {
      setErrors(err.response?.data?.errors || [{ msg: "Something went wrong" }]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sync dark mode with localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 transition-colors duration-300
      bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-2xl p-8 rounded-2xl shadow-xl border 
        bg-white/80 backdrop-blur-lg border-purple-200 
        dark:bg-gray-900/80 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center 
          bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ✍️ Create a New Blog Post
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg transition 
              border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          <textarea
            name="content"
            placeholder="Write your content..."
            value={form.content}
            onChange={handleChange}
            rows={6}
            required
            className="w-full px-4 py-3 border rounded-lg transition 
              border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full text-gray-700 dark:text-gray-300"
          />

          {errors.length > 0 && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {errors.map((e, i) => (
                <p key={i}>{e.msg}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold shadow-lg 
              bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 
              hover:scale-105 active:scale-95 transition-transform"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>

        {/* ✅ Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg transition 
              bg-gray-300 text-gray-800 hover:bg-gray-400
              dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
}
