import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white mt-1">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-3">
        
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold">📖 My Personal Blog Platform</h2>
          <p className="mt-2 text-sm text-gray-200">
            Share your thoughts, ideas, and stories with the world.  
            A simple blogging platform built with ❤️ and MERN.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/dashboard" className="hover:underline">Home</a></li>
            <li><a href="/create" className="hover:underline">Create Post</a></li>
            <li><a href="/login" className="hover:underline">Login</a></li>
            <li><a href="/register" className="hover:underline">Register</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-2xl">
            <a href="https://github.com/ankushkumark" target="_blank" rel="noreferrer" className="hover:text-gray-300">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/ankush-kumar-87b200268?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" className="hover:text-gray-300">
              <FaLinkedin />
            </a>
            <a href="https://x.com/AnkushGaut88119?t=MiiqXQdIgyZtq78CyCzCbg&s=09" target="_blank" rel="noreferrer" className="hover:text-gray-300">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/30 text-center py-4 text-sm text-gray-200">
        © {new Date().getFullYear()} My Blog App. All rights reserved. - This Project is Designed and Developed By Mr. Ankush Kumar
      </div>
    </footer>
  );
}
