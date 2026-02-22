import axios from "axios";
import { HTTP_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
    const response = await axios.get(`${HTTP_URL}/room/${slug}`);
    console.log(response.data);
    return response.data.room.id;
}

export default async function ChatRoom1({ params }: { params: { slug: string } }) {
    
    const parsedParams = (await params);
    const slug = parsedParams.slug; 
    const roomId = await getRoomId(slug);

    return <ChatRoom id={roomId} />
}