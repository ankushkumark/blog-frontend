import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { ThumbsUp, Heart, Laugh, MessageCircle, ArrowLeft } from "lucide-react";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [reaction, setReaction] = useState(null);

  // ✅ Dark mode sync
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ✅ Current user
  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.user?.id || decoded.id;
    } catch {}
  }

  // Fetch post details
  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data);

        // agar user already react kar chuka hai
        const userReaction = res.data.likes?.find(
          (like) => like.user === currentUserId
        );
        if (userReaction) setReaction(userReaction.type);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, currentUserId]);

  // ✅ Handle Reaction
  const handleReaction = async (type) => {
    try {
      const newType = reaction === type ? null : type;
      const res = await api.post(`/posts/${post._id}/react`, { type: newType });
      setPost(res.data);
      setReaction(newType);
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  // ✅ Handle Comment
  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text: comment });
      setPost(res.data);
      setComment("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse text-lg">
          Loading post...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        {/* Back Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>

        {/* Post Image */}
        {post.image && (
          <img src={post.image} alt="Post" className="w-full h-80 object-cover" />
        )}

        <div className="p-6">
          {/* Title & Author */}
          <h1 className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 mb-3">
            {post.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {post.content}
          </p>

          <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3 mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                ✍️ {post.author?.name || "Anonymous"}
              </p>
              <p className="text-xs text-pink-600 dark:text-pink-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Reaction + Comment */}
          <div className="flex items-center gap-6 border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
            <button
              onClick={() => handleReaction("like")}
              className={`flex items-center gap-1 ${
                reaction === "like"
                  ? "text-blue-600"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <ThumbsUp className="w-5 h-5" /> Like {post.likes?.length || 0}
            </button>

            <button
              onClick={() => handleReaction("love")}
              className={`flex items-center gap-1 ${
                reaction === "love"
                  ? "text-red-500"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Heart className="w-5 h-5" /> Love
            </button>

            <button
              onClick={() => handleReaction("laugh")}
              className={`flex items-center gap-1 ${
                reaction === "laugh"
                  ? "text-yellow-500"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Laugh className="w-5 h-5" /> Haha
            </button>
          </div>

          {/* Comment Input */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              Write a Comment
            </h2>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-3 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Add your comment..."
            />
            <button
              onClick={handleComment}
              className="mt-3 px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              Comments ({post.comments?.length || 0})
            </h2>
            {post.comments?.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {c.text}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      By {c.user?.name || "Anonymous"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
