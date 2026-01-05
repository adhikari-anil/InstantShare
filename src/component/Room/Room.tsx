import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSocket } from "@/context/socketContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";
import { Check, Copy, Lock } from "lucide-react";

const Room = ({ roomType }: { roomType: string }) => {
  const [roomName, setRoomName] = useState<string>("");
  const [id, setID] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const navigate = useNavigate();

  const socket = useSocket();

  const generateRoomCode = () => {
    const id =
      roomName.trim().toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 8);
    setID(id);
    socket.emit("joinAsSender", id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleClick = () => {
    if (!roomName.trim()) {
      toast.error("RoomName Missing..");
      return;
    }
    generateRoomCode();
  };

  const copyToClipboard = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const qrValue = id
    ? `${window.location.origin}/receiver?name=${encodeURIComponent(
        roomName
      )}&roomCode=${encodeURIComponent(id)}`
    : "";

  useEffect(() => {
    const handleReceiverJoined = (data: {
      username: string;
      socketId: string;
    }) => {
      console.log("Receiver joined:", data);
      navigate("/upload", {
        state: {
          roomCode: id,
          username: data.username,
          socketId: data.socketId,
        },
      });
    };

    socket.on("receiver-joined", handleReceiverJoined);
    return () => {
      socket.off("receiver-joined", handleReceiverJoined);
    };
  }, [socket, id, navigate]);

  return (
    <DialogHeader className="flex flex-col gap-4">
      <DialogTitle className="text-lg md:text-2xl font-bold flex items-center gap-3">
        <Lock className="w-6 h-6" />
        <span>Create {roomType}</span>
      </DialogTitle>
      <DialogDescription>
        Create a {roomType} room for secure file sharing.
      </DialogDescription>
      <div className="flex flex-col gap-4">
        {qrValue ? (
          <>
            <div className="bg-card border border-border rounded-lg p-5 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Room ID
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-input px-4 py-3 rounded-md font-mono text-sm text-foreground font-semibold break-all">
                  {id}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2.5 hover:bg-input rounded-md transition-colors flex-shrink-0"
                  title="Copy room ID"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-col justify-center items-center gap-2">
              <QRCodeCanvas value={qrValue} size={200} />
              <p className="text-lg text-bold text-center break-words">
                Waiting for receiver...
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              id="roomName"
              placeholder="Provide roomcode initial name..."
              className="border border-red-50 p-4 rounded-md text-lg font-semibold"
              onChange={handleChange}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
              onClick={handleClick}
            >
              Generate Room
            </button>
          </div>
        )}
      </div>
    </DialogHeader>
  );
};

export default Room;
