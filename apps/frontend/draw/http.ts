import { HTTP_BACKEND } from "../config"
import axios from "axios";

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {id: number, message: string}) => {
        const messageData = JSON.parse(x.message)
        return {
            ...messageData.shape,
            id: x.id
        };
    })

    return shapes;
}