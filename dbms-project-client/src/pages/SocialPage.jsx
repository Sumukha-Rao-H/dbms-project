import React from "react";
import TopNavbar from "../components/TopNavbar";

export default function SocialPage() {
  const [tab, setTab] = React.useState("send");
  const [receiverUid, setReceiverUid] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [incomingFriends, setIncomingFriends] = React.useState([]);
  const [loadingIncoming, setLoadingIncoming] = React.useState(false);

  React.useEffect(() => {
    const fetchIncomingRequests = async () => {
      if (tab === "incoming") {
        try {
          setLoadingIncoming(true);
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/getPendingRequests?uid=3`
          );
          const data = await res.json();
          setIncomingFriends(data.friends);
        } catch (err) {
          console.error("Failed to fetch incoming requests", err);
        } finally {
          setLoadingIncoming(false);
        }
      }
    };

    fetchIncomingRequests();
  }, [tab]);

  const handleSendRequest = async () => {
    const senderUid = 1; // TODO: Replace with actual UID from auth
    if (!receiverUid.trim()) {
      setMessage("Please enter a UID.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/sendFriendRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ senderUid, receiverUid }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Friend request sent!");
        setReceiverUid("");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Failed to send friend request:", err);
      setMessage("Failed to send request.");
    }
  };

  const handleFriendAction = async (user1uid, action) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/updateFriend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1uid,
          user2uid: 3,
          action,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIncomingFriends((prev) => prev.filter((f) => f.uid !== user1uid));
      } else {
        console.error("Error:", data.error);
      }
    } catch (err) {
      console.error("Failed to update friend request:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#dbe2dc] text-[#335765] dark:bg-[#1e1e1e] dark:text-[#dbe2dc]">
      <TopNavbar />
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-1/3 max-w-xs bg-white border-r border-[#b6d9e0] shadow-inner p-6 dark:bg-[#2a2f33] dark:border-[#3f4b50]">
          <h2 className="text-2xl font-bold mb-6">Social</h2>
          {["send", "incoming"].map((t) => (
            <div
              key={t}
              onClick={() => setTab(t)}
              className={`transition cursor-pointer p-3 rounded-xl font-medium capitalize ${
                tab === t
                  ? "bg-[#335765] text-white shadow dark:bg-[#4a707a]"
                  : "hover:bg-[#74a8a4] hover:text-white dark:hover:bg-[#3f4b50] dark:hover:text-white"
              }`}
            >
              {t === "send" ? "Send Request" : "Incoming Requests"}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white shadow-xl rounded-xl p-6 h-full flex flex-col dark:bg-[#2f2f2f]">
            <h2 className="text-2xl font-semibold mb-4">
              {tab === "send" ? "Send Friend Request" : "Incoming Requests"}
            </h2>
            <div className="flex-1 bg-[#b6d9e0] rounded-lg p-4 overflow-y-auto text-[#335765] dark:bg-[#3b3b3b] dark:text-[#dbe2dc] flex items-center justify-center">
              {tab === "send" ? (
                <div className="w-full max-w-md space-y-4">
                  <input
                    type="text"
                    placeholder="Enter UID to send request"
                    value={receiverUid}
                    onChange={(e) => setReceiverUid(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#74a8a4] focus:outline-none focus:ring-2 focus:ring-[#335765] dark:bg-[#2a2f2f] dark:border-[#4f6666] dark:text-white"
                  />
                  <button
                    onClick={handleSendRequest}
                    className="w-full bg-[#335765] text-white py-2 px-4 rounded-lg hover:bg-[#274852] transition dark:bg-[#4a707a] dark:hover:bg-[#3f5f66]"
                  >
                    Send Request
                  </button>
                  {message && (
                    <p className="text-sm text-center text-[#335765] dark:text-white/80">
                      {message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-md space-y-4">
                  {loadingIncoming ? (
                    <p className="text-center italic text-[#335765]/70 dark:text-white/50">
                      Loading incoming requests...
                    </p>
                  ) : incomingFriends.length === 0 ? (
                    <p className="text-center italic text-[#335765]/70 dark:text-white/50">
                      No incoming friend requests.
                    </p>
                  ) : (
                    incomingFriends.map((friend) => (
                      <div
                        key={friend.uid}
                        className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
                            alt={friend.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="text-[#335765] dark:text-white">
                            {friend.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleFriendAction(friend.uid, "accept")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleFriendAction(friend.uid, "reject")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
