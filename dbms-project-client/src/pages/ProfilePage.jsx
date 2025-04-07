import React, { useEffect } from "react";
import TopNavbar from "../components/TopNavbar";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState("account");
  const [isDarkMode, setIsDarkMode] = React.useState(
    localStorage.getItem("theme") === "dark"
  );
  const [selectedSetting, setSelectedSetting] = React.useState("visibility");


  useEffect(() => {
    console.log(user);
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
          <h2 className="text-2xl font-bold mb-6">Profile</h2>
          <div className="space-y-3">
            {["account", "settings"].map((tab) => (
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white shadow-xl rounded-xl p-6 h-full flex flex-col dark:bg-[#2f2f2f]">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{selectedTab}</h2>

            <div className="flex-1 bg-[#b6d9e0] rounded-lg p-4 overflow-y-auto text-[#335765] dark:bg-[#3b3b3b] dark:text-[#dbe2dc]">
              {selectedTab === "account" ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src="https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png"
                    alt="Profile"
                    className="rounded-full w-24 h-24 border-4 border-[#335765] dark:border-[#4a707a]"
                  />
                  <div className="text-center">
                    <p className="text-xl font-semibold">{user.name}</p>
                    <p className="text-sm text-[#335765]/70 dark:text-white/50">UID: {user.uid}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Settings menu inside main content */}
                  <div className="flex gap-3 mb-4">
                    {["visibility", "notifications", "theme"].map((setting) => (
                      <button
                        key={setting}
                        onClick={() => setSelectedSetting(setting)}
                        className={`capitalize px-4 py-2 rounded-xl font-medium transition-colors ${
                          selectedSetting === setting
                            ? "bg-[#335765] text-white dark:bg-[#4a707a]"
                            : "bg-white text-[#335765] hover:bg-[#74a8a4] hover:text-white dark:bg-[#2f2f2f] dark:text-[#dbe2dc] dark:hover:bg-[#3f4b50]"
                        }`}
                      >
                        {setting}
                      </button>
                    ))}
                  </div>

                  {/* Settings content */}
                  {selectedSetting === "theme" ? (
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
                      [{selectedSetting} settings mock interface]
                    </div>
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
