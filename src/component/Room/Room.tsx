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

const Room = ({ roomType }: { roomType: string }) => {
  const [roomName, setRoomName] = useState<string>("");
  const [id, setID] = useState<string>("");

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
      <DialogTitle className="text-lg md:text-2xl font-bold">
        Create {roomType} Room: {id}
      </DialogTitle>
      <DialogDescription>
        Create a {roomType} room for secure file sharing.
      </DialogDescription>
      <div className="flex flex-col gap-4">
        {qrValue ? (
          <div className="mt-4 flex flex-col justify-center items-center gap-2">
            <QRCodeCanvas value={qrValue} size={200} />
            <p className="text-lg text-bold text-center break-words">
              Waiting for receiver...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <label htmlFor="roomName" className="text-lg font-semibold">
              Room Name: {roomName}
            </label>
            <input
              type="text"
              id="roomName"
              className="border p-4 rounded-md text-lg font-semibold"
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
