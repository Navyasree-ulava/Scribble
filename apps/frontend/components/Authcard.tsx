"use client";

import { useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../config";
import { useRouter } from "next/navigation";

export default function AuthCard({
  title,
  buttonText,
  isSignup,
}: {
  title: string;
  buttonText: string;
  isSignup: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignup ? "signup" : "signin";
    try {
        const response = await axios.post(`${HTTP_BACKEND}/${endpoint}`, {
            email,
            password,
            ...(isSignup ? { name } : {}),
        });

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        
        alert(`${isSignup ? "Signup" : "Login"} successful!`);
        router.push(isSignup ? "/login" : "/dashboard");
    } catch (error: any) {
        console.error(error);
        alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="w-full max-w-[320px] bg-[#0a0f1d]/90 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-5 shadow-2xl">
      <h2 className="text-lg font-bold text-white mb-4 text-center tracking-tight">
        {title}
      </h2>

      <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-900/40 border border-slate-800/80 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-900/40 border border-slate-800/80 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-900/40 border border-slate-800/80 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
          required
        />

        <button
          type="submit"
          className="mt-2 bg-purple-600 hover:bg-purple-500 transition-all duration-300 rounded-lg py-2 text-xs font-bold text-white shadow-md active:scale-95"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}