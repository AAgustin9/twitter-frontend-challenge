import { useEffect } from "react";
import { socketService } from "../service/SocketService";

export function useSocket() {
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return socketService;
}
