import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import SocialPage from "./pages/SocialPage";
import ProfilePage from "./pages/ProfilePage";
import PostsPage from "./pages/PostPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);