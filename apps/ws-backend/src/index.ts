import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/config/env';

const wss = new WebSocketServer({ port: 8080 });

const userSockets = new Map<string, Set<WebSocket>>();
const SocketUsers = new Map<WebSocket, string>();
const rooms = new Map<string, Set<WebSocket>>();

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
    
    ws.on('message', function message(data) {
        let parsedData: any;
        try {
            parsedData = JSON.parse(data.toString());
        } catch (error) {
            return;
        }
        if(parsedData.type === "join") {
            const roomId = parsedData.roomId;
            if(!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }
            rooms.get(roomId)?.add(ws);
        }

        if(parsedData.type === "chat") {
            const roomId = parsedData.roomId;
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
            rooms.get(roomId)?.forEach((socket) => {
                socket.send(JSON.stringify({
                    type: "chat",
                    message,
                    userId
                }));
            })
        }

        if(parsedData.type === "leave") {
            const roomId = parsedData.roomId;
            if(!roomId) {
                return;
            }
            rooms.get(roomId)?.delete(ws);

            // If room becomes empty, delete it
            // This prevents memory leaks
            if (rooms.get(roomId)?.size === 0) {
                rooms.delete(roomId);
            }
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

console.log("WebSocket server is running on ws://localhost:8080");



