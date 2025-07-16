import { useSocket } from "@/context/socketContext";
import peerService from "@/services/peer";
import { useEffect } from "react";

const FileView = ({ room }: { room: string }) => {
  const socket = useSocket();

  useEffect(() => {
    const handleIncommingOffer = async ({
      from,
      offer,
    }: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log("Receiver offer: ", offer);
      const answer = await peerService.getAnswer(offer);
      socket.emit("answer", { to: from, answer: answer });
    };
    console.log("Socket le listen garxa");
    socket.on("incomming-offer", handleIncommingOffer);

    return () => {
      socket.off("incomming-offer", handleIncommingOffer);
    };
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-5">
      <h1>Connected to Room: {room}</h1>
      <h1>FileView</h1>
      <div className="flex flex-col gap-4 h-full w-3/4">
        <div className="text-center">
          <p>This is the file view section.</p>
        </div>
        <div className="border-2 flex justify-center items-center flex-1 w-full">
          Preview Section
        </div>
        <div className="flex justify-center">
          <button className="border-2 rounded-r-sm bg-blue-500 text-white cursor-pointer w-1/2">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileView;
