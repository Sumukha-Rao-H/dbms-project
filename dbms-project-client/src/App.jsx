import { useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = React.useState(null);

  const [registerData, setRegisterData] = React.useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = React.useState("");
  const [loginError, setLoginError] = React.useState("");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "Login failed");
      } else {
        setLoginError("");
        console.log("Logged in user:", data.user);
        login(data.user); // Store user data in context
        navigate("/home"); // Redirect to home on success
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Something went wrong. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerData.name,
          age: registerData.age,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Registration failed");
        return;
      }

      alert("Registration successful!");
      setRegisterData({
        name: "",
        age: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setPasswordError("");
      setActiveForm("login"); // Optionally switch to login form after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      setPasswordError("Something went wrong. Please try again.");
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#dbe2dc] text-[#335765] px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to ChatMate</h1>

      {!activeForm && (
        <div className="space-x-4">
          <button
            onClick={() => setActiveForm("login")}
            className="px-6 py-2 bg-[#335765] text-white rounded-lg shadow hover:bg-[#74a8a4] transition"
          >
            Login
          </button>
          <button
            onClick={() => setActiveForm("register")}
            className="px-6 py-2 bg-[#7f543d] text-white rounded-lg shadow hover:bg-[#a76e53] transition"
          >
            Register
          </button>
        </div>
      )}

      {activeForm === "login" && (
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mt-6 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center">Login</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={loginData.email}
            onChange={handleLoginChange}
            className="w-full px-4 py-2 border border-[#b6d9e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74a8a4]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={loginData.password}
            onChange={handleLoginChange}
            className="w-full px-4 py-2 border border-[#b6d9e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74a8a4]"
          />
          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#335765] text-white py-2 rounded-lg hover:bg-[#74a8a4] transition"
          >
            Login
          </button>
          <p
            onClick={() => {
              setActiveForm(null);
              setLoginError("");
            }}
            className="text-center text-sm text-[#335765] cursor-pointer hover:underline"
          >
            Go back
          </p>
        </form>
      )}

      {activeForm === "register" && (
        <form
          onSubmit={handleRegisterSubmit}
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mt-6 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center">Register</h2>
          <input
            name="name"
            value={registerData.name}
            onChange={handleRegisterChange}
            type="text"
            placeholder="Name"
            required
            className="w-full px-4 py-2 border border-[#b6d9e0] rounded-lg"
          />
          <input
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-[#b6d9e0] rounded-lg"
          />
          <input
            name="age"
            value={registerData.age}
            onChange={handleRegisterChange}
            type="number"
            placeholder="Age"
            required
            className="w-full px-4 py-2 border border-[#b6d9e0] rounded-lg"
          />
          <input
            name="password"
            value={registerData.password}
            onChange={handleRegisterChange}
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-[#b6d9e0] rounded-lg"
          />
          <input
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            type="password"
            placeholder="Confirm Password"
            required
            className={`w-full px-4 py-2 border ${
              passwordError ? "border-red-500" : "border-[#b6d9e0]"
            } rounded-lg`}
          />
          {passwordError && (
            <p className="text-red-500 text-sm text-center">{passwordError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#7f543d] text-white py-2 rounded-lg hover:bg-[#a76e53] transition"
          >
            Register
          </button>
          <p
            onClick={() => {
              setActiveForm(null);
              setPasswordError("");
            }}
            className="text-center text-sm text-[#335765] cursor-pointer hover:underline"
          >
            Go back
          </p>
        </form>
      )}
    </div>
  );
}
