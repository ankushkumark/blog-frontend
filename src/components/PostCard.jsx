import React, { useState, useEffect } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { ThumbsUp, Heart, Laugh, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post, onUpdate, onDelete }) {
  const [reaction, setReaction] = useState(null);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showReactions, setShowReactions] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: post.title, content: post.content });
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();

  // ✅ Current user
  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.user?.id || decoded.id;
    } catch {}
  }

  // ✅ Check if already reacted
  useEffect(() => {
    const userReaction = post.likes?.find(
      (like) => like.user === currentUserId
    );
    if (userReaction) setReaction(userReaction.type);
  }, [post.likes, currentUserId]);

  // ✅ Handle Reaction
  const handleReaction = async (type) => {
  try {
    const newType = reaction === type ? null : type;
    const res = await api.post(`/posts/${post._id}/react`, { type: newType });

    setReaction(newType);
    setLikesCount(res.data.likes.length);

    // 🔹 Preserve author
    const updatedPost = { ...res.data, author: post.author };

    onUpdate(updatedPost);
  } catch (err) {
    console.error("Reaction failed:", err);
  }
};


  // ✅ Handle Comment
  const handleComment = async () => {
  try {
    const res = await api.post(`/posts/${post._id}/comment`, { text: comment });
    setComment("");
    setShowCommentBox(false);

    // 🔹 Preserve author
    const updatedPost = { ...res.data, author: post.author };

    onUpdate(updatedPost);
  } catch (err) {
    console.error("Comment failed:", err);
  }
};


  // ✅ Handle Edit
  const handleEdit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.put(`/posts/${post._id}`, form);

    // 🔹 Preserve author
    const updatedPost = { ...res.data, author: post.author };

    onUpdate(updatedPost);
    setEditMode(false);
  } catch (err) {
    console.error("Update failed:", err);
  }
};


  // ✅ Format Date
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

  // ✅ Content Preview
  const contentPreview = expanded
    ? post.content
    : post.content.length > 120
    ? post.content.slice(0, 120) + "..."
    : post.content;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full h-60 object-cover cursor-pointer"
          onClick={() => navigate(`/posts/${post._id}`)}
        />
      )}

      <div className="p-5 flex flex-col flex-grow">
        {editMode ? (
          // 🔹 Edit Form
          <form onSubmit={handleEdit} className="space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:text-gray-200"
              required
            />
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:text-gray-200"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded">
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                type="button"
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {contentPreview}
            </p>

            {post.content.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline self-start"
              >
                {expanded ? "See Less" : "See More"}
              </button>
            )}

            {/* ✅ Footer with Author + Date + Edit/Delete */}
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1">
                  ✍️ {post.author?.name || "Anonymous"}
                </span>
                <br />
                <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                  {formatDate(post.createdAt)}
                </span>
              </div>

              {currentUserId === post.author?._id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this post?")) return;
                      try {
                        await api.delete(`/posts/${post._id}`);
                        onDelete(post._id);
                      } catch (err) {
                        console.error("Delete failed:", err);
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ✅ Like & Comment Section */}
      <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200 dark:border-gray-700">
        <div
          className="relative"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction("like");
            }}
            className={`flex items-center gap-1 ${
              reaction === "like"
                ? "text-blue-600"
                : reaction === "love"
                ? "text-red-500"
                : reaction === "laugh"
                ? "text-yellow-500"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {reaction === "like" && <ThumbsUp className="w-5 h-5" />}
            {reaction === "love" && <Heart className="w-5 h-5" />}
            {reaction === "laugh" && <Laugh className="w-5 h-5" />}
            {!reaction && <ThumbsUp className="w-5 h-5" />}
            {likesCount}
          </button>

          {showReactions && (
            <div className="absolute -top-12 left-0 flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
              <button onClick={() => handleReaction("like")}>
                <ThumbsUp className="w-6 h-6 text-blue-500" />
              </button>
              <button onClick={() => handleReaction("love")}>
                <Heart className="w-6 h-6 text-red-500" />
              </button>
              <button onClick={() => handleReaction("laugh")}>
                <Laugh className="w-6 h-6 text-yellow-500" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-green-600"
        >
          <MessageCircle className="w-5 h-5" /> Comment
        </button>
      </div>

      {showCommentBox && (
        <div className="px-5 pb-4">
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
          />
          <button
            onClick={handleComment}
            className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Post Comment
          </button>
        </div>
      )}
    </div>
  );
}
