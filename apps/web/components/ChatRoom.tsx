import axios from "axios";
import { HTTP_URL } from "../app/config";

import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId: string) {
    const response = await axios.get(`${HTTP_URL}/chats/${roomId}`);
    return response.data.messages;
}

export async function ChatRoom({id}:{id:string}) {
    const messages = await getChats(id);
    return <ChatRoomClient id={id} messages={messages} />
}