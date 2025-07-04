import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { io } from "socket.io-client";

const Socket = io("http://localhost:4000", {
  transports: ["websocket"],
  autoConnect: false,
});

const Reciever = () => {
  const [room, setRoom] = useState<string>("");
  const [senderDisconnected, setSenderDisconnected] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  const handleClick = () => {
    if (!room.trim()) {
      alert("Please enter a room name.");
      return;
    }
    // Here you would typically emit a socket event to join the room
    console.log(`Joining room: ${room}`);

    Socket.emit("joinAsReceiver", room);
  };

  useEffect(() => {
    // connect to the socket if not already connected
    if (!Socket.connected) {
      Socket.connect();
      console.log("Receiver connected");
    }

    Socket.on("sender-joined", (data) => {
      console.log("Sender joined the room:", data);
    });

    Socket.on("sender-disconnected", (data) => {
      console.log("Sender disconnected from the room:", data);
      setSenderDisconnected(true);
    });

    return () => {
      Socket.off("sender-joined");
      Socket.off("sender-disconnected");
      Socket.disconnect();
    };
  }, []);

  return (
    <div className="mx-auto h-screen w-11/12 flex items-center justify-center">
      <div className="flex flex-col gap-4">
        <div></div>
        <div className="flex flex-col gap-4">
          <label htmlFor="roomId" className="text-lg font-semibold">
            Room ID:
          </label>
          <input
            type="text"
            id="roomId"
            className="border p-4 rounded-md text-lg font-semibold"
            onChange={handleChange}
          />
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                onClick={handleClick}
              >
                Join Room
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-bold">
                  {senderDisconnected
                    ? "Sender Disconnected 😢"
                    : "Click Download below:"}
                </DialogTitle>
                <DialogDescription className="flex flex-col gap-4 text-xl">
                  {!senderDisconnected ? (
                    <>
                      <Link to="#" className="text-blue-600 font-semibold">
                        Download
                      </Link>
                      <span className="text-lg text-gray-500 font-medium">
                        Thank you for using InstantShare!
                      </span>
                    </>
                  ) : (
                    <span className="text-lg text-red-600 font-semibold">
                      The sender has disconnected. Please wait or try again
                      later.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Reciever;
