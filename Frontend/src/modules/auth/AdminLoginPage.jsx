import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // SUPER ADMIN LOGIN
    if (email === "super@gmail.com" && password === "1234") {
      localStorage.setItem("role", "superadmin");
      navigate("/superadmin/dashboard");
    }
    // SCHOOL ADMIN LOGIN
    else if (email === "school@gmail.com" && password === "1234") {
      localStorage.setItem("role", "schooladmin");
      navigate("/schooladmin/dashboard");
    }
    else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-[#111827] p-8 rounded-2xl w-[350px] space-y-4">

        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <input
          className="w-full p-3 bg-black border border-white/20 rounded-lg"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 bg-black border border-white/20 rounded-lg"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 py-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-xs text-gray-400 text-center">
          super@gmail.com / school@gmail.com
        </p>

      </div>
    </div>
  );
}