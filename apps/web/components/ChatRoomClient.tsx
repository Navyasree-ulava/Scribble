"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: { message: string }[];
    id: string;
}) {

    const { socket, loading } = useSocket();
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (!socket || loading) return;

        socket.send(JSON.stringify({
            type: "join",
            roomId: Number(id)
        }));

        const handleMessage = (event: MessageEvent) => {
            const parsedData = JSON.parse(event.data);

            if (parsedData.type === "chat") {
                setChats(prev => [
                    ...prev,
                    { message: parsedData.message }
                ]);
            }
        };

        socket.onmessage = handleMessage;

        return () => {
            socket.send(JSON.stringify({
                type: "leave",
                roomId: Number(id)
            }));
            socket.onmessage = null;
        };

    }, [socket, loading, id]);

    return (
        <div>
            {chats.map((c, index) => (
                <div key={index}>{c.message}</div>
            ))}

            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
            />

            <button onClick={() => {
                if (!currentMessage.trim()) return;

                socket?.send(JSON.stringify({
                    type: "chat",
                    roomId: Number(id),
                    message: currentMessage
                }));

                setCurrentMessage("");
            }}>
                Send
            </button>
        </div>
    );
}