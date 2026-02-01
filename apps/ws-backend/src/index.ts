import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/config/env';

const wss = new WebSocketServer({ port: 8080 });

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
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if(!decodedToken || typeof decodedToken === "string") {
        ws.close();
        return;
    }
    const userId = decodedToken.userId;
    
});

console.log("WebSocket server is running on ws://localhost:8080");



