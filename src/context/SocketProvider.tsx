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
    () => io("http://localhost:4000"),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
