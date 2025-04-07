import React, { useEffect, useState } from "react";
import TopNavbar from "../components/TopNavbar";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth(); // Assuming you have a user context to get the logged-in user's info
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const uid = user.uid; // Get the user ID from the context
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getFriends?uid=${uid}`);
        const data = await response.json();
        setFriends(data.friends);
        if (data.friends.length > 0) {
          setSelectedUser(data.friends[0]);
        }
        console.log(user);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#dbe2dc] text-[#335765] dark:bg-[#1e1e1e] dark:text-[#dbe2dc]">
      <TopNavbar />
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-1/3 max-w-xs bg-white border-r border-[#b6d9e0] shadow-inner p-6 dark:bg-[#2a2f33] dark:border-[#3f4b50]">
          <h2 className="text-2xl font-bold mb-6">Friends</h2>
          <div className="space-y-3">
            {friends.map((user) => (
              <div
                key={user.uid}
                onClick={() => setSelectedUser(user)}
                className={`transition cursor-pointer p-3 rounded-xl font-medium ${
                  selectedUser?.uid === user.uid
                    ? "bg-[#335765] text-white shadow dark:bg-[#4a707a]"
                    : "hover:bg-[#74a8a4] hover:text-white dark:hover:bg-[#3f4b50] dark:hover:text-white"
                }`}
              >
                {user.name}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="flex-1 p-6">
          <div className="bg-white shadow-xl rounded-xl p-6 h-full flex flex-col dark:bg-[#2f2f2f]">
            <h2 className="text-2xl font-semibold mb-4">
              Chat with{" "}
              <span className="text-[#7f543d]">
                {selectedUser?.name || "someone"}
              </span>
            </h2>

            <div className="flex-1 bg-[#b6d9e0] rounded-lg p-4 overflow-y-auto text-[#335765] dark:bg-[#3b3b3b] dark:text-[#dbe2dc]">
              <div className="text-[#335765]/70 italic dark:text-white/50">
                [Chat window mock]
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg border border-[#b6d9e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#74a8a4] dark:bg-[#4b4b4b] dark:border-[#555] dark:placeholder:text-[#aaa]"
              />
              <button className="bg-[#335765] text-white px-5 py-2 rounded-lg hover:bg-[#74a8a4] transition dark:bg-[#4a707a]">
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
