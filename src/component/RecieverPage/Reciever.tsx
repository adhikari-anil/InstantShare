import { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";
import FileView from "./FileView";
import toast from "react-hot-toast";
import { ArrowRight, Lock, Zap } from "lucide-react";

const Receiver = () => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [autoJoin, setAutoJoin] = useState(false);

  const socket = useSocket();

  const handleJoinRoom = () => {
    if (!room.trim() || !username.trim()) return;

    socket.emit("joinAsReceiver", { room, username });
  };

  useEffect(() => {
    console.log("QR Checks!");
    const params = new URLSearchParams(window.location.search);
    console.log("Parameters: ", params);

    const qrName = params.get("name");
    const qrCode = params.get("roomCode");

    if (qrName && qrCode) {
      setUsername(qrName);
      setRoom(qrCode);
      setAutoJoin(true);
    }
  }, []);

  useEffect(() => {
    console.log("Auto join checks...");
    if (autoJoin && room && username) {
      socket.emit("joinAsReceiver", { room, username });
      setAutoJoin(false);
    }
  }, [socket, room, username, autoJoin]);

  useEffect(() => {
    console.log("Listener checks!");
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      {!joined ? (
        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 mb-4 mx-auto">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 text-balance">
              Ready to Receive?
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join a room to start receiving files securely and instantly
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Your Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 font-medium"
                placeholder="Enter your name"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>

            {/* Room ID Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Room ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 font-medium"
                placeholder="Enter room code"
                onChange={(e) => setRoom(e.target.value)}
                value={room}
              />
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-700/50">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-xs text-slate-400">
                  End-to-End Encrypted
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-xs text-slate-400">Lightning Fast</span>
              </div>
            </div>

            {/* Join Button */}
            <button
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group ${
                !room.trim() || !username.trim()
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
              }`}
              onClick={handleJoinRoom}
              disabled={!room.trim() || !username.trim()}
            >
              Join Room
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 text-xs mt-6">
            Connection secured • Real-time transfer • No file size limits
          </p>
        </div>
      ) : (
        <div className="text-2xl font-semibold text-green-700 relative z-10 flex flex-col gap-4 w-full h-full bg-white/40 backdrop-blur-lg p-4 rounded-2xl border border-white/60 shadow-2xl">
          <FileView room={room} />
        </div>
      )}
    </div>
  );
};

export default Receiver;
