import React, { useEffect } from "react";
import TopNavbar from "../components/TopNavbar";

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = React.useState("visibility");
  const [isDarkMode, setIsDarkMode] = React.useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#dbe2dc] text-[#335765] dark:bg-[#1e1e1e] dark:text-[#dbe2dc]">
      <TopNavbar />
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-1/3 max-w-xs bg-white border-r border-[#b6d9e0] shadow-inner p-6 dark:bg-[#2a2f33] dark:border-[#3f4b50]">
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          <div className="space-y-3">
            {["visibility", "notifications", "personalization"].map((tab) => (
              <div
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`capitalize transition-colors cursor-pointer p-3 rounded-xl font-medium ${
                  selectedTab === tab
                    ? "bg-[#335765] text-white shadow dark:bg-[#4a707a]"
                    : "hover:bg-[#74a8a4] hover:text-white dark:hover:bg-[#3f4b50] dark:hover:text-white"
                }`}
              >
                {tab}
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="bg-white shadow-xl rounded-xl p-6 h-full flex flex-col dark:bg-[#2f2f2f]">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {selectedTab}
            </h2>

            <div className="flex-1 bg-[#b6d9e0] rounded-lg p-4 overflow-y-auto text-[#335765] dark:bg-[#3b3b3b] dark:text-[#dbe2dc]">
              {selectedTab === "personalization" ? (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Dark Mode</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isDarkMode}
                      onChange={() => setIsDarkMode(!isDarkMode)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full dark:bg-[#555] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#74a8a4] relative transition-all duration-300">
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                          isDarkMode ? "translate-x-full" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>
              ) : (
                <div className="text-[#335765]/70 italic dark:text-white/50">
                  [{selectedTab} settings mock interface]
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
