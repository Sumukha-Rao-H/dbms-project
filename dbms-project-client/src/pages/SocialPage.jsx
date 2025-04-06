import React from "react";
import TopNavbar from "../components/TopNavbar";

export default function SocialPage() {
  const [tab, setTab] = React.useState("send");

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
              <div className="italic text-[#335765]/70 dark:text-white/50">
                [{tab} interface mock]
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
