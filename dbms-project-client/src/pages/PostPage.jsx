import React, { useState } from "react";
import TopNavbar from "../components/TopNavbar";

export default function PostsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mockPosts = [
    { id: 1, author: "Alice", content: "Just finished a React project!" },
    { id: 2, author: "Bob", content: "Loving Tailwind CSS lately 🌟" },
    { id: 3, author: "Charlie", content: "Check out my new blog post 🔗" },
  ];

  return (
    <div className="min-h-screen bg-[#dbe2dc] text-[#335765] dark:bg-[#1e1e1e] dark:text-[#dbe2dc]">
      <TopNavbar />
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-1/3 max-w-xs bg-white border-r border-[#b6d9e0] shadow-inner p-6 dark:bg-[#2a2f33] dark:border-[#3f4b50]">
          <h2 className="text-2xl font-bold mb-6">Posts</h2>
          {["all", "my posts", "liked"].map((category) => (
            <div
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`capitalize transition-colors cursor-pointer p-3 rounded-xl font-medium ${
                selectedCategory === category
                  ? "bg-[#335765] text-white shadow dark:bg-[#4a707a]"
                  : "hover:bg-[#74a8a4] hover:text-white dark:hover:bg-[#3f4b50] dark:hover:text-white"
              }`}
            >
              {category}
            </div>
          ))}
        </aside>

        {/* Main Feed */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {selectedCategory}
          </h2>

          <div className="space-y-6">
            {mockPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-xl shadow-md dark:bg-[#2f2f2f]"
              >
                <div className="text-sm text-[#74a8a4] dark:text-[#9fd3d0] mb-1">
                  {post.author}
                </div>
                <div className="text-base">{post.content}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
