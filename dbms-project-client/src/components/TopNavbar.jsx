import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TopNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="w-full bg-[#335765] text-white px-6 py-3 flex justify-between items-center shadow dark:bg-[#1f2b30]">
      <div className="space-x-6">
        <button
          onClick={() => navigate("/home")}
          className="hover:text-[#b6d9e0] transition"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/posts")}
          className="hover:text-[#b6d9e0] transition"
        >
          Posts
        </button>
        <button
          onClick={() => navigate("/social")}
          className="hover:text-[#b6d9e0] transition"
        >
          Social
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="hover:text-[#b6d9e0] transition"
        >
          Profile
        </button>
      </div>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="text-[lavender] hover:text-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
