"use client";

import { WEBSOCKET_BACKEND } from "../config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WEBSOCKET_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMTdhMDFjOC1lZGRlLTRhOGItYjAxZi1kNmQzZDEzZWU0Y2MiLCJpYXQiOjE3NzI3Mjk1ODl9.3M94rIwfWjEwJmGfusrXrBE2zvOAMo_jEFhtyt_whjE`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join",
                roomId: Number(roomId)
            });
            console.log(data);
            ws.send(data)
        }
        
    }, [])
   
    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}