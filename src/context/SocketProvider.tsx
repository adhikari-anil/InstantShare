import { useMemo } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./socketContext";
import type { ReactNode } from "react";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
const backend = import.meta.env.VITE_BACKEND_URL;

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useMemo<Socket<DefaultEventsMap, DefaultEventsMap>>(
    () =>
      io(backend, {
        transports: ["websocket"],
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
