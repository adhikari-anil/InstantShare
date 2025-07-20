import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSocket } from "@/context/socketContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import Loading from "../Loading/Loading";

const Room = ({ roomType }: { roomType: string }) => {
  const [roomName, setRoomName] = useState<string>("");
  const [id, setID] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useNavigate();

  const socket = useSocket();

  const handleReceiverStatus = (id: string) => {
    socket.on("receiver-joined", (data) => {
      console.log("Receiver joined:", data);
      console.log("Receiver joined:", data.socketId);
      setLoading(false);
      router("/upload", {
        state: {
          roomCode: id,
          username: data.username,
          socketId: data.socketId,
        },
      });
    });
  };

  const generateRoomCode = () => {
    const id =
      roomName.trim().toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 8);
    setID(id);
    if (id) {
      socket.emit("joinAsSender", id);
    }
    setLoading(true);
    handleReceiverStatus(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleClick = () => {
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }
    generateRoomCode();
  };

  return (
    <DialogHeader className="flex flex-col gap-4">
      <DialogTitle className="text-lg md:text-2xl font-bold">
        Create {roomType} Room: {id}
      </DialogTitle>
      <DialogDescription>
        Create a {roomType} room for secure file sharing.
      </DialogDescription>
      <div className="flex flex-col gap-4">
        {loading ? (
          <Loading />
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
