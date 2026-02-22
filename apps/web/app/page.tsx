"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row h-16 "></div>
      <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID" className="flex flex-row h-16 w-1/2 "/>
      <button onClick={() => router.push(`/room/${roomId}`)}>Join Room</button>
      <div className="flex flex-row h-16 "></div>
    </div>
  )
}