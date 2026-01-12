import React, { useState, useRef, useEffect } from "react";
import { Upload, File, X, Check } from "lucide-react";
import peer from "@/services/peer";
import { useSocket } from "@/context/socketContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type FileWithStatus = {
  file: File;
  done: boolean;
};

const DragandDrop = ({
  roomCode,
  socketId,
  username,
}: {
  roomCode: string;
  socketId: string;
  username: string;
}) => {
  const [files, setFile] = useState<FileWithStatus[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success"
  >("idle");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasStarted = useRef(false);
  const [state, setState] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = Array.from(e.dataTransfer.files);
    setFile(droppedFile.map((file) => ({ file, done: false })));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleUploadClick = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload.");
      return;
    }
    if (peer.dataChannel?.readyState === "open") {
      for (const [i, file] of files.entries()) {
        await peer.sendFile(file.file);
        setFile((prev) =>
          prev.map((f, index) => (index === i ? { ...f, done: true } : f))
        );
      }
      setUploadStatus("success");
      setTimeout(() => {
        setUploadStatus("idle");
      }, 2000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files!);
    setFile(selectedFiles.map((file) => ({ file, done: false })));
  };

  const removeFile = (fileIndex: number) => {
    setFile((prevfile) => prevfile.filter((_, index) => index !== fileIndex));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "🖼️";
    if (["pdf"].includes(ext || "")) return "📄";
    if (["doc", "docx"].includes(ext || "")) return "📝";
    if (["xls", "xlsx"].includes(ext || "")) return "📊";
    if (["mp4", "avi", "mov"].includes(ext || "")) return "🎥";
    if (["mp3", "wav", "aac"].includes(ext || "")) return "🎵";
    return "📁";
  };

  useEffect(() => {
    if (!socket) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleIncommingAnswer = async ({ answer }: any) => {
      await peer.setRemoteDescription(answer);
    };

    // Ice candidate handler...
    const handleIceCandidate = async ({
      candidate,
    }: {
      candidate: RTCIceCandidate;
    }) => {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    };

    // Ice candidate gathering in sender's end..
    peer.onIceCandidate((candidate) => {
      socket.emit("ice-candidate", {
        to: socketId,
        candidate: candidate.toJSON(),
      });
    });

    socket.on("incomming-answer", handleIncommingAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("incomming-answer", handleIncommingAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [socket, socketId]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    const handleConnection = async () => {
      if (
        peer._peer?.connectionState === "connected" ||
        peer._peer?.signalingState === "have-local-offer"
      ) {
        console.log(
          "Connection already in progress or established. Skipping offer creation."
        );
        return;
      }
      //create data channel
      if (!peer.dataChannel) {
        const dataChannel = peer._peer?.createDataChannel("message");

        // set up data channel handlers
        if (dataChannel) {
          dataChannel.onopen = () => {
            console.log("Data channel opened! ");
          };

          dataChannel.onerror = (error) => {
            console.log("Data channel error: ", error);
          };

          peer.dataChannel = dataChannel;
        }
      }

      const offer = await peer.getOffer();
      socket.emit("offer", { to: socketId, offer });
    };
    handleConnection();
  }, [socket, socketId]);

  useEffect(() => {
    if (peer._peer) {
      peer._peer.onconnectionstatechange = () => {
        setState(peer._peer?.connectionState || "");
      };
    }
  }, []);

  useEffect(() => {
    if (state === "disconnected" || state === "idle") {
      toast.error("Receiver Disconnected...");
      peer._peer?.close();
      setTimeout(() => {
        navigate("/");
      }, 4000);
    }
    if (state === "failed") {
      toast.error("Disposing the room...");
      peer._peer?.close();
      setTimeout(() => {
        navigate("/");
      }, 4000);
    }
  }, [state, navigate]);

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-4">
        {state === "disconnected" || state === "failed" ? (
          <h1>
            {username} has disconnected from room {roomCode}
          </h1>
        ) : (
          <>
            {/* Connection Status */}
            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/30 rounded-xl backdrop-blur-sm">
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  {state === "connected"
                    ? "Connected"
                    : state === "connecting"
                    ? "Connecting..."
                    : state === "disconnected"
                    ? "Disconnected"
                    : state === "failed"
                    ? "Connection Failed"
                    : "Idle"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {" "}
                  • Room : {roomCode}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-slate-300 bg-slate-700/50 px-3 py-1 rounded">
                  {socketId.slice(0, 8)}...
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        className={`
          relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02]
          ${
            isDragActive
              ? "border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 shadow-lg shadow-cyan-500/30 blur-sm"
              : files.length > 0
              ? "border-emerald-400/50 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5"
              : "border-slate-600/50 bg-gradient-to-br from-slate-700/10 to-slate-800/20 hover:border-cyan-400/50 hover:bg-slate-700/30"
          }
          ${uploadStatus === "uploading" ? "animate-pulse" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center space-y-4">
          {uploadStatus === "uploading" ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-600 font-medium">Uploading files...</p>
            </div>
          ) : uploadStatus === "success" ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <p className="text-green-600 font-medium">Upload successful!</p>
            </div>
          ) : (
            <>
              <div
                className={`p-4 rounded-full transition-all duration-300 ${
                  isDragActive ? "bg-cyan-400/25 scale-110" : "bg-slate-600/30"
                }`}
              >
                <Upload
                  className={`w-8 h-8 transition-colors duration-300 ${
                    isDragActive ? "text-cyan-300 scale-110" : "text-slate-400"
                  }`}
                />
              </div>

              <div>
                <p className="text-xl font-semibold text-white">
                  {files.length > 0 ? "Ready to upload" : "Drag files here"}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  or click to browse
                </p>
              </div>
              {files.length === 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  Always for speedy P2P file transfer.
                </p>
              )}
            </>
          )}
        </div>

        <input
          type="file"
          multiple
          onChange={handleChange}
          ref={inputRef}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white/70 flex items-center">
            <File className="w-5 h-5 mr-2" />
            Selected Files
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-2xl">{getFileIcon(file.file.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                </div>

                {file.done && <Check className="w-3 h-3 text-black" />}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center items-center p-4">
        <button
          onClick={() => {
            handleUploadClick();
          }}
          className="p-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};

export default DragandDrop;
