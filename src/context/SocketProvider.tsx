import { useMemo } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./socketContext";
import type { ReactNode } from "react";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useMemo<Socket<DefaultEventsMap, DefaultEventsMap>>(
    () =>
      io(import.meta.env.VITE_SOCKET_URL,{
        path: "/socket.io",
        transports: ["websocket"],
      }),
    []
  );
  console.log("Used socket url: ", socket);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
