import React, { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-600">No posts available.</p>
      )}
    </div>
  );
}
