"use client";

import { WS_URL } from "../config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const ws = new WebSocket(`${WS_URL}?token=${token}`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join",
                roomId: Number(roomId)
            });
            ws.send(data)
        }

        return () => {
            ws.close();
        }
        
    }, [roomId])
   
    if (!socket) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 font-medium">
            <div className="flex flex-col items-center gap-4">
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <span className="text-xs uppercase tracking-widest opacity-70">Connecting to server...</span>
            </div>
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}