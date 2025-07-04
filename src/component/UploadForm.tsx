import { useEffect, useState } from "react";
import DragandDrop from "./DropZone/DragandDrop";
import { useLocation } from "react-router";
import { io } from "socket.io-client";
import Loading from "./Loading/Loading";

const Socket = io("http://localhost:4000", {
  transports: ["websocket"],
  autoConnect: false,
});

const UploadForm = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const roomCode = location.state?.roomCode;

  useEffect(() => {
    setLoading(true);
    setConnected(false);
    if (!Socket.connected) {
      Socket.connect();
      console.log("Sender connected to socket server");
    }

    // Join the room
    if (roomCode) {
      Socket.emit("joinAsSender", roomCode);
    }

    Socket.on("receiver-joined", (data) => {
      console.log("Receiver joined the room:", data);
      setConnected(true);
      setLoading(false);
    });

    Socket.on("receiver-disconnected", (data) => {
      console.log("Receiver disconnected from the room:", data);
      setConnected(false);
      setLoading(false);
    });

    return () => {
      Socket.off("receiver-joined");
      Socket.off("receiver-disconnected");
      Socket.disconnect();
    };
  }, [roomCode]);

  return (
    <div className="mx-auto max-w-2xl p-4 flex flex-col items-center justify-center h-screen">
      {connected === false && loading ? (
        <div className="h-full flex flex-col text-2xl font-semibold text-gray-700">
          <div>
            <h1>RoomID: {roomCode}</h1>
          </div>
          <div>
            <Loading />
            <p className="text-lg">Waiting for receiver to join...</p>
          </div>
        </div>
      ) : connected ? (
        <div className="text-2xl font-semibold text-green-700">
          Receiver has joined the room!
          <DragandDrop roomCode={roomCode} />
        </div>
      ) : (
        <div className="text-2xl font-semibold text-red-700">
          No receiver has joined the room yet.
        </div>
      )}
    </div>
  );
};

export default UploadForm;
