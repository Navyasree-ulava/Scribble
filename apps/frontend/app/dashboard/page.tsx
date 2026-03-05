"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
import { Plus, LogIn, LayoutGrid, Clock } from "lucide-react";

interface Room {
    id: number;
    slug: string;
}

export default function Dashboard() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [slug, setSlug] = useState("");
    const [joinSlug, setJoinSlug] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [joinLoading, setJoinLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${HTTP_BACKEND}/rooms`, {
                headers: { Authorization: token }
            });
            setRooms(response.data.rooms);
        } catch (err) {
            console.error("Failed to fetch rooms", err);
        }
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${HTTP_BACKEND}/room`, { slug }, {
                headers: { Authorization: token }
            });
            router.push(`/canvas/${response.data.roomId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create room");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${HTTP_BACKEND}/room/${joinSlug}`);
            router.push(`/canvas/${response.data.room.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Room not found");
        } finally {
            setJoinLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#020617] text-slate-200">
            {/* Background */}
            <div className="fixed inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(71,85,105,0.2) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(71,85,105,0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="fixed inset-0 z-0 bg-radial-at-t from-purple-500/5 via-transparent to-transparent" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                <header className="flex justify-between items-center mb-16 px-2">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                            Scribble <span className="text-purple-500">Board</span>
                        </h1>
                        <p className="text-slate-500 text-sm">Create, share, and collaborate in real-time.</p>
                    </div>
                    <button 
                        onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
                        className="text-xs font-semibold px-4 py-2 border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-slate-900 transition-all text-slate-400 hover:text-white"
                    >
                        Sign Out
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Recent Rooms */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-2 mb-4 ml-1">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recent Projects</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <div 
                                        key={room.id}
                                        onClick={() => router.push(`/canvas/${room.id}`)}
                                        className="group p-5 bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl hover:border-purple-500/40 hover:bg-slate-900/60 transition-all cursor-pointer shadow-lg"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                                                    <LayoutGrid className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                                    {room.slug}
                                                </h3>
                                            </div>
                                            <Plus className="w-4 h-4 text-slate-600 group-hover:text-white transition-all transform group-hover:rotate-90" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 bg-slate-900/20 border border-dashed border-slate-800/60 rounded-3xl flex flex-col items-center justify-center">
                                    <p className="text-slate-500 text-sm">No boards yet. Create your first one!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* New Room */}
                        <div className="p-6 bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl shadow-xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> New Canvas
                            </h3>
                            <form onSubmit={handleCreateRoom} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Unique slug..."
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-700"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="w-full bg-purple-600 hover:bg-purple-500 transition-all py-3 rounded-xl text-sm font-bold text-white shadow-lg active:scale-95"
                                >
                                    {createLoading ? "Initializing..." : "Create Project"}
                                </button>
                            </form>
                        </div>

                        {/* Join Room */}
                        <div className="p-6 bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <LogIn className="w-4 h-4" /> Join Team
                            </h3>
                            <form onSubmit={handleJoinRoom} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter slug..."
                                    value={joinSlug}
                                    onChange={(e) => setJoinSlug(e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-slate-700 transition-all placeholder:text-slate-700"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={joinLoading}
                                    className="w-full bg-slate-800 hover:bg-slate-700 transition-all py-3 rounded-xl text-sm font-bold text-white shadow-sm active:scale-95"
                                >
                                    {joinLoading ? "Joining..." : "Access Room"}
                                </button>
                            </form>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center rounded-xl">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
