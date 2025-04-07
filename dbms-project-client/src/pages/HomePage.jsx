import React, { useEffect, useState, useRef } from "react";
import TopNavbar from "../components/TopNavbar";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/getFriends?uid=${user.uid}`
        );
        const data = await response.json();
        setFriends(data.friends);
        if (data.friends.length > 0) {
          setSelectedUser(data.friends[0]);
        }
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    if (user) fetchFriends();
  }, [user]);

  // Fetch chat messages when selectedUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await fetch(
          `${backendUrl}/api/getChatMessages?uid1=${user.uid}&uid2=${selectedUser.uid}`
        );
        const data = await res.json();
        setChatMessages(data.messages);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching chat messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser, user.uid]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${backendUrl}/api/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.uid,
          receiverId: selectedUser.uid,
          text: newMessage.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setChatMessages((prev) => [...prev, data.data]);
        setNewMessage("");
        scrollToBottom();
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#dbe2dc] text-[#335765] dark:bg-[#1e1e1e] dark:text-[#dbe2dc]">
      <TopNavbar />
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-1/3 max-w-xs bg-white border-r border-[#b6d9e0] shadow-inner p-6 dark:bg-[#2a2f33] dark:border-[#3f4b50]">
          <h2 className="text-2xl font-bold mb-6">Friends</h2>
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.uid}
                onClick={() => setSelectedUser(friend)}
                className={`transition cursor-pointer p-3 rounded-xl font-medium ${
                  selectedUser?.uid === friend.uid
                    ? "bg-[#335765] text-white shadow dark:bg-[#4a707a]"
                    : "hover:bg-[#74a8a4] hover:text-white dark:hover:bg-[#3f4b50] dark:hover:text-white"
                }`}
              >
                {friend.name}
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
              {chatMessages.length === 0 ? (
                <div className="text-[#335765]/70 italic dark:text-white/50">
                  No messages yet.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {chatMessages.map((msg) => {
                    const isOwnMessage = msg.senderId === user.uid;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`inline-block px-4 py-2 rounded-xl shadow-sm text-sm sm:text-base break-words max-w-[75%] transition-all duration-300 ${
                            isOwnMessage
                              ? "bg-[#74a8a4] text-white dark:bg-[#4a707a]"
                              : "bg-white text-[#335765] dark:bg-[#4b4b4b] dark:text-[#dbe2dc]"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2 rounded-lg border border-[#b6d9e0] bg-white focus:outline-none focus:ring-2 focus:ring-[#74a8a4] dark:bg-[#4b4b4b] dark:border-[#555] dark:placeholder:text-[#aaa]"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#335765] text-white px-5 py-2 rounded-lg hover:bg-[#74a8a4] transition dark:bg-[#4a707a]"
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
