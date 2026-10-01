import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/config/env';
import { prismaClient } from '@repo/db/client';

// Railway injects PORT; fall back to 8080 for local development.
const PORT = Number(process.env.PORT || 8080);

// Bind to 0.0.0.0 so Railway's proxy can reach the server.
const wss = new WebSocketServer({ port: PORT, host: "0.0.0.0" });

const userSockets = new Map<string, Set<WebSocket>>();
const SocketUsers = new Map<WebSocket, string>();
const rooms = new Map<number, Set<WebSocket>>();

function checkUser(token: string) {
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        if(!decodedToken || typeof decodedToken === "string") {
            return null;
        }
        return decodedToken.userId;
    } catch (error) {
        return null;
    }
}

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if(!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    if(!token) {
        ws.close();
        return;
    }
    const userId = checkUser(token);

    if(!userId) {
        ws.close();
        return;
    }

    if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
    }
    userSockets.get(userId)!.add(ws);
    SocketUsers.set(ws, userId);
    
    ws.on('message', async function message(data) {
        try {
            let parsedData: any;
            try {
                parsedData = JSON.parse(data.toString());
            } catch (error) {
                return;
            }
            if(parsedData.type === "join") {
                const roomId = Number(parsedData.roomId);
                if(!rooms.has(roomId)) {
                    rooms.set(roomId, new Set());
                }
                rooms.get(roomId)?.add(ws);
            }

            if(parsedData.type === "chat") {
                const roomId = Number(parsedData.roomId);
                const message = parsedData.message;
                if(!roomId || !message) {
                    return;
                }
                if (!rooms.get(roomId)?.has(ws)) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "You are not a member of this room"
                    }));
                    return;
                }

                const chat = await prismaClient.chat.create({
                    data: {
                        roomId,
                        message,
                        userId
                    }
                })

                rooms.get(roomId)?.forEach((socket) => {
                    socket.send(JSON.stringify({
                        type: "chat",
                        message,
                        userId,
                        id: chat.id
                    }));
                })
            }

            if(parsedData.type === "delete") {
                const roomId = Number(parsedData.roomId);
                const chatId = Number(parsedData.id);
                if(!roomId || !chatId) {
                    return;
                }

                await prismaClient.chat.delete({
                    where: {
                        id: chatId
                    }
                });

                rooms.get(roomId)?.forEach((socket) => {
                    socket.send(JSON.stringify({
                        type: "delete",
                        id: chatId
                    }));
                });
            }

            if(parsedData.type === "leave") {
                const roomId = parsedData.roomId;
                if(!roomId) {
                    return;
                }
                rooms.get(roomId)?.delete(ws);

                if (rooms.get(roomId)?.size === 0) {
                    rooms.delete(roomId);
                }
            }
        } catch (e) {
            console.error(e);
        }
    })

    ws.on('close', function close() {
        // Find which user this socket belongs to
        const userId = SocketUsers.get(ws);
        if (!userId) return;

        // Remove socket from all rooms it was part of
        for (const [roomId, sockets] of rooms.entries()) {
            sockets.delete(ws);

            // Delete room if no sockets are left
            if (sockets.size === 0) {
                rooms.delete(roomId);
            }
        }
        userSockets.get(userId)?.delete(ws);
        if (userSockets.get(userId)?.size === 0) {
            userSockets.delete(userId);
        }
        SocketUsers.delete(ws);
    })

});

console.log(`WebSocket server listening on port ${PORT}`);

const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down`);
    wss.close(() => {
        void prismaClient.$disconnect().then(() => process.exit(0));
    });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));



