import { createContext, useEffect, ReactNode, useContext } from "react";
import { socketService } from "../service/SocketService";

const SocketContext = createContext(socketService);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketService}>
      {children}
    </SocketContext.Provider> 
  );
};

export const useSocket = () => useContext(SocketContext);