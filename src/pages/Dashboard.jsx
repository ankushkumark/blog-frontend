import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { Moon, Sun } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [search, setSearch] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(6);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Search filter
  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-md border-b border-purple-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          {/* Brand */}
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent drop-shadow-sm text-center md:text-left">
  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-red-400" />
  My Personal Blog Platform
</h1>

          {/* Search + Actions */}
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center md:justify-end">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 md:w-60 lg:w-72 px-3 py-1.5 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-800" />
              )}
            </button>

            <button
              onClick={() => navigate("/create")}
              className="px-3 sm:px-4 py-1.5 rounded-md text-sm font-semibold text-white 
                         bg-gradient-to-r from-green-400 to-green-600 shadow 
                         hover:scale-105 hover:shadow-green-300/50 
                         active:scale-95 transition"
            >
              Create Post
            </button>

            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1.5 rounded-md text-sm font-semibold text-white 
                         bg-gradient-to-r from-red-400 to-red-600 shadow 
                         hover:scale-105 hover:shadow-red-300/50 
                         active:scale-95 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Blog Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg animate-pulse">
            Loading posts...
          </p>
        ) : filteredPosts.length > 0 ? (
          <>
            {/* Responsive Grid */}
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center">
              {filteredPosts.slice(0, visiblePosts).map((p) => (
                <PostCard
                  key={p._id}
                  post={p}
                  onUpdate={(updatedPost) =>
                    setPosts(
                      posts.map((post) =>
                        post._id === updatedPost._id ? updatedPost : post
                      )
                    )
                  }
                  onDelete={(id) =>
                    setPosts(posts.filter((post) => post._id !== id))
                  }
                />
              ))}
            </div>

            {/* Load More */}
            {visiblePosts < filteredPosts.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisiblePosts(visiblePosts + 6)}
                  className="px-6 py-2 rounded-lg font-semibold text-white 
                             bg-gradient-to-r from-purple-500 to-pink-600 
                             shadow-lg hover:scale-105 hover:shadow-pink-300/50 
                             active:scale-95 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <img
              src="https://illustrations.popsy.co/gray/no-data.svg"
              alt="No posts"
              className="w-48 sm:w-60 mb-6 drop-shadow-md"
            />
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg font-medium">
              No posts found. Try creating your first blog!
            </p>
            <button
              onClick={() => navigate("/create")}
              className="mt-6 px-5 sm:px-6 py-2 rounded-lg font-semibold text-white 
                         bg-gradient-to-r from-purple-500 to-pink-600 
                         shadow-lg hover:scale-105 hover:shadow-pink-300/50 
                         active:scale-95 transition"
            >
              + Create Post
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
