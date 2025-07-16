import { useState } from "react";
import { useSocket } from "@/context/socketContext";
import FileView from "./FileView";

const Receiver = () => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const socket = useSocket();

  const handleJoinRoom = () => {
    if (!room.trim() || !username.trim()) return;

    socket.emit("joinAsReceiver", { room, username });
    setJoined(true);
  };

  return (
    <div className="mx-auto h-screen w-11/12 flex items-center justify-center">
      {!joined ? (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <label className="text-lg font-semibold">Username</label>
          <input
            type="text"
            className="border p-4 rounded-md text-lg font-semibold"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />

          <label className="text-lg font-semibold">Room ID</label>
          <input
            type="text"
            className="border p-4 rounded-md text-lg font-semibold"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          />

          <button
            className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
            onClick={handleJoinRoom}
            disabled={!room.trim() || !username.trim()}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="text-2xl font-semibold text-green-700">
          <FileView room={room} />
        </div>
      )}
    </div>
  );
};

export default Receiver;
