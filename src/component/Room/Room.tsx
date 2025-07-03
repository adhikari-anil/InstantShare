import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { useState } from "react";

const Room = ({ roomType }: { roomType: string }) => {
  const [roomName, setRoomName] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");

  const generateRoomCode = () => {
    const id =
      roomName.trim().toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 8);
    setRoomCode(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleClick = () => {
    generateRoomCode();
  };

  return (
    <DialogHeader className="flex flex-col gap-4">
      <DialogTitle className="text-2xl font-bold">
        Create {roomType} Room
      </DialogTitle>
      <DialogDescription>
        Create a {roomType} room for secure file sharing.
      </DialogDescription>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <label htmlFor="roomName" className="text-lg font-semibold">
            Room Name:
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
        <div className="relative w-full max-w-md">
          <input
            type="text"
            id="roomCode"
            className="w-full border-2 p-4 pr-20 rounded-md text-lg font-semibold"
            placeholder="Room Code"
            value={roomCode}
            readOnly
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-black px-3 py-1 text-sm transition cursor-pointer">
            <Copy className="w-4 h-4 inline-block mr-1" />
          </button>
        </div>
      </div>
    </DialogHeader>
  );
};

export default Room;
