"use client";

import { useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

export default function CreateRoomPage() {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { slug },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const roomId = response.data.roomId;
      alert("Room created successfully!");
      router.push(`/canvas/${roomId}`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] relative flex items-center justify-center">
      {/* Background with Sphere Grid */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-[#020617]/70 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create Your <span className="text-purple-400">Canvas</span>
        </h2>
        
        <p className="text-slate-400 text-center mb-8">
          Enter a unique name for your room to start collaborating in real-time.
        </p>

        <form onSubmit={handleCreateRoom} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="slug" className="text-sm font-medium text-slate-300 ml-1">
              Room Slug (Name)
            </label>
            <input
              id="slug"
              type="text"
              placeholder="e.g. creative-brainstorm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-600 shadow-inner"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 rounded-full py-4 font-semibold text-white shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Magic..." : "Create Room"}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center text-sm text-slate-500">
            Infinite collaborative canvas await.
        </div>
      </div>
    </div>
  );
}
