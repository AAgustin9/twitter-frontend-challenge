import { io, Socket } from "socket.io-client";
import type { ChatDTO, MessageDTO } from "./index";

interface ServerToClient {
    chat_history: (history: MessageDTO[]) => void;
    new_message: (message: MessageDTO) => void;
    error: (err: { message: string}) => void;
}

interface ClientToServer {
    start_chat: (receiverId: string) => void;
    send_message: (opts: { receiverId: string; content: string}) => void;
}

class SocketService {
    private socket?: Socket<ServerToClient, ClientToServer>;

    connect() {
        const token = localStorage.getItem("token")?.replace(/^Bearer\s+/i, "");
        this.socket = io(
            "http://localhost:8080",
            { 
                auth: { token },
                transports: ["websocket"],
            }
        );
        
        this.socket.on("connect", () => {
            console.log("✅ Connected to WebSocket:", this.socket?.id);
        });
        
        this.socket.on("disconnect", (reason) => {
            console.warn("🔌 Disconnected:", reason);
        });
    }

    disconnect() {
        this.socket?.disconnect();
    }

    startChat(receiverId: string) {
        this.socket?.emit("start_chat", receiverId);
    }

    send_message(receiverId: string, content: string) {
        this.socket?.emit("send_message", { receiverId, content });
    }

    onHistory(fn: (msgs: MessageDTO[]) => void) {
        this.socket?.on("chat_history", fn);
    }

    onNewMessage(fn: (msg: MessageDTO) => void) {
        this.socket?.on("new_message", fn);
    }

    onError(fn: (err: { message: string }) => void) {
        this.socket?.on("error", fn);
    }

    getSocket() {
        return this.socket;
    }
}

export const socketService = new SocketService();