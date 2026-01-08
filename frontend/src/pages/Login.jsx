import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0b10] to-[#2b0f18] relative">
    
    {/* Subtle Burgundy Glow */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#6b1d2a] opacity-20 blur-3xl rounded-full"></div>
    </div>

    {/* Login Card */}
    <form
      onSubmit={handleLogin}
      className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
    >
      <h2 className="text-3xl font-semibold text-white text-center mb-2">
        Welcome Back
      </h2>

      <p className="text-gray-400 text-center mb-6">
        Sign in to your account
      </p>

      {error && (
        <p className="text-red-400 text-sm mb-4 text-center">
          {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        className="auth-input mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="auth-input mb-6"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7a2232] to-[#4a121e] text-white font-medium hover:brightness-110 transition"
      >
        Login
      </button>

      <p className="text-gray-400 text-sm text-center mt-6">
        No account?
        <a href="/signup" className="text-[#b84a5a] ml-2 hover:underline">
          Signup
        </a>
      </p>
    </form>
  </div>
);

};

export default Login;
