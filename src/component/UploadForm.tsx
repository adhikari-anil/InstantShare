import { useLocation } from "react-router";
import DragandDrop from "./DropZone/DragandDrop";
const UploadForm = () => {
  const location = useLocation();
  const { roomCode, username, socketId } = location.state;

  return (
    <div className="h-[100dvh] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative h-full z-10 flex flex-col items-center justify-center p-2 md:p-4">
        <div className="w-full max-w-3xl">
          <div className="relative h-full overflow-hidden">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-60"></div>

            {/* Card content */}
            <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/40 border border-slate-700/50 rounded-3xl backdrop-blur-2xl shadow-2xl p-4">
              <DragandDrop
                roomCode={roomCode}
                socketId={socketId}
                username={username}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
