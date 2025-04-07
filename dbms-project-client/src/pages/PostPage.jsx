import React, { useState, useEffect } from "react";
import TopNavbar from "../components/TopNavbar";
import { useAuth } from "../context/AuthContext";

export default function PostsPage() {
  const { user } = useAuth(); // Assuming you have a user context to get the logged-in user's info
  const [selectedTab, setSelectedTab] = useState("feed");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/getFriendsPosts?uid=${
            user.uid
          }`
        );
        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (selectedTab === "feed") {
      fetchPosts();
    }
  }, [selectedTab, user]);
  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      setMessage("Please enter an image URL.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/createPost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid, // You need to ensure currentUser is available
            imageUrl,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create post.");
        return;
      }

      setMessage("Post created successfully!");
      setImageUrl(""); // Clear input after post
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#dbe2dc] text-[#335765] dark:bg-[#1e1e1e] dark:text-[#dbe2dc]">
      <TopNavbar />
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-1/3 max-w-xs bg-white border-r border-[#b6d9e0] shadow-inner p-6 dark:bg-[#2a2f33] dark:border-[#3f4b50]">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>
          {["feed", "create post"].map((tab) => (
            <div
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setMessage("");
              }}
              className={`capitalize transition-colors cursor-pointer p-3 rounded-xl font-medium ${
                selectedTab === tab
                  ? "bg-[#335765] text-white shadow dark:bg-[#4a707a]"
                  : "hover:bg-[#74a8a4] hover:text-white dark:hover:bg-[#3f4b50] dark:hover:text-white"
              }`}
            >
              {tab}
            </div>
          ))}
        </aside>

        {/* Main Section */}
        <main className="flex-1 p-6 overflow-y-auto">
          {selectedTab === "feed" ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded-xl shadow-md dark:bg-[#2f2f2f] space-y-4"
                >
                  <div className="text-sm text-[#74a8a4] dark:text-[#9fd3d0]">
                    {post.name || "Unknown"}
                  </div>
                  <div className="w-full flex justify-center items-center bg-black/5 rounded-md">
                    <img
                      src={post.imageUrl}
                      alt={`${post.name}'s post`}
                      className="max-w-full max-h-[500px] object-contain rounded-md"
                    />
                  </div>

                  {/* 💬 Comment Section */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-[#335765] dark:text-[#9fd3d0] mb-2">
                      Comments
                    </h3>

                    {/* 🧪 Mock Comments */}
                    <div className="space-y-2 mb-3">
                      <div className="text-sm text-gray-800 dark:text-gray-300">
                        <span className="font-semibold">alex:</span> Nice photo!
                      </div>
                      <div className="text-sm text-gray-800 dark:text-gray-300">
                        <span className="font-semibold">lily:</span> Love this
                        view 😍
                      </div>
                    </div>

                    {/* ➕ Add Comment */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 rounded-lg border border-[#74a8a4] focus:outline-none focus:ring-2 focus:ring-[#335765] dark:bg-[#2a2f2f] dark:border-[#4f6666] dark:text-white"
                      />
                      <button className="bg-[#335765] text-white px-3 py-2 rounded-lg hover:bg-[#274852] transition dark:bg-[#4a707a] dark:hover:bg-[#3f5f66]">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Keep your "Create Post" section unchanged
            <div className="flex justify-center items-center h-full">
              <div className="w-full max-w-md bg-[#f0f7f4] dark:bg-[#2a2f2f] p-8 rounded-2xl shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-center text-[#335765] dark:text-white">
                  Create a Post
                </h2>

                <input
                  type="text"
                  placeholder="Enter Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#74a8a4] focus:outline-none focus:ring-2 focus:ring-[#335765] dark:bg-[#3a3f42] dark:border-[#4f6666] dark:text-white"
                />

                <button
                  onClick={handleCreatePost}
                  className="w-full bg-[#335765] text-white py-2 px-4 rounded-lg hover:bg-[#274852] transition dark:bg-[#4a707a] dark:hover:bg-[#3f5f66]"
                >
                  Post
                </button>

                {message && (
                  <p className="text-sm text-center text-[#335765] dark:text-white/80">
                    {message}
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
