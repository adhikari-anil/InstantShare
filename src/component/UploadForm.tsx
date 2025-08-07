import { useLocation } from "react-router";
import DragandDrop from "./DropZone/DragandDrop";
const UploadForm = () => {
  const location = useLocation();
  console.log("Receiver Info: ", location);
  const { roomCode, username, socketId } = location.state;

  return (
    <div className="mx-auto max-w-2xl p-4 flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <div className="text-2xl font-semibold text-green-700 mb-4">
          <DragandDrop roomCode={roomCode} socketId={socketId} username={username}/>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
