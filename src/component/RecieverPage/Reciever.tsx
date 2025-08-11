import { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";
import FileView from "./FileView";
import toast from "react-hot-toast";

const Receiver = () => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const socket = useSocket();

  const handleJoinRoom = () => {
    if (!room.trim() || !username.trim()) return;

    socket.emit("joinAsReceiver", { room, username });
  };

  useEffect(() => {
    const handleInvalidRoom = () => {
      toast.error("Invalid room code");
      setUsername("");
      setRoom("");
      setJoined(false); // Reset UI
    };

    const handleSenderJoined = () => {
      setJoined(true); // Now it's confirmed, we can show FileView
    };

    socket.on("invalid-room", handleInvalidRoom);
    socket.on("sender-joined", handleSenderJoined);

    return () => {
      socket.off("invalid-room", handleInvalidRoom);
      socket.off("sender-joined", handleSenderJoined);
    };
  }, [socket]);

  return (
    <div
      className="mx-auto h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1678599518417-727f0e377d50?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {!joined ? (
        <div
          className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://plus.unsplash.com/premium_photo-1678599518417-727f0e377d50?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            filter: "brightness(1.1) contrast(1.05)", // slightly enhance the image
          }}
        >
          {/* Dark overlay to make content pop */}
          <div className="absolute inset-0 bg-black/40 z-0" />

          {/* Glass Box */}
          <div className="relative z-10 flex flex-col gap-4 w-full max-w-md backdrop-blur-lg p-8 rounded-2xl border border-white/60 shadow-2xl text-white">
            <label className="text-xl font-bold text-white">Username</label>
            <input
              type="text"
              className="border border-white/50 p-4 rounded-md text-lg font-semibold backdrop-blur-md placeholder-neutral-900 text-neutral-200 placeholder:text-sm"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />

            <label className="text-xl font-bold text-white">Room ID</label>
            <input
              type="text"
              className="border border-white/50 p-4 rounded-md text-lg font-semibold backdrop-blur-md placeholder-neutral-900 text-neutral-200 placeholder:text-sm"
              placeholder="Enter room ID"
              onChange={(e) => setRoom(e.target.value)}
              value={room}
            />

            <button
              className={`bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-all font-semibold ${!room.trim() || !username.trim()
      ? 'bg-blue-300 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              onClick={handleJoinRoom}
              disabled={!room.trim() || !username.trim()}
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <div className="text-2xl font-semibold text-green-700 relative z-10 flex flex-col gap-4 w-full max-w-md bg-white/40 backdrop-blur-lg p-4 rounded-2xl border border-white/60 shadow-2xl">
          <FileView room={room} />
        </div>
      )}
    </div>
  );
};

export default Receiver;
