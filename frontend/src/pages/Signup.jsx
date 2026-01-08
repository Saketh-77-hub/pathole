import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Account created. Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-black via-[#1a0b10] to-[#2b0f18] relative">

      {/* Subtle Burgundy Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 
                        bg-[#6b1d2a] opacity-20 blur-3xl rounded-full"></div>
      </div>

      {/* Signup Card Wrapper */}
      <div className="relative z-10 w-full max-w-md">

        {/* Glow Beam */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 
                        w-[85%] h-[3px]
                        bg-gradient-to-r from-transparent via-[#8a2a3a] to-transparent
                        blur-sm opacity-80"></div>

        {/* Signup Card */}
        <form
          onSubmit={handleSignup}
          className="bg-white/5 backdrop-blur-xl border border-white/10 
                     rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        >
          <h2 className="text-3xl font-semibold text-white text-center mb-2">
            Create Account
          </h2>

          <p className="text-gray-400 text-center mb-6">
            Join us and get started
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <input
            type="text"
            placeholder="Full Name"
            className="auth-input mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            className="w-full py-3 rounded-lg 
                       bg-gradient-to-r from-[#7a2232] to-[#4a121e] 
                       text-white font-medium hover:brightness-110 transition"
          >
            Sign Up
          </button>

          <p className="text-gray-400 text-sm text-center mt-6">
            Already have an account?
            <a href="/" className="text-[#b84a5a] ml-2 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
