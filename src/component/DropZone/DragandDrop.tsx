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

  console.log("Files ma k hudoraxah tah: ", files);

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
    console.log("Upload Button clicked...");
    if (peer.dataChannel?.readyState === "open") {
      for (const [i, file] of files.entries()) {
        console.log("output from upload button: ", file);
        await peer.sendFile(file.file); // This will push data through the same channel
        console.log("File Sent!");

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
    const handleIncommingAnswer = async ({ from, answer }: any) => {
      console.log("Answer received from: ", from);
      await peer.setRemoteDescription(answer);
      console.log("Connection almost completed...");
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
      console.log("offer created: ", offer);
      console.log("receiver ko tah: ", socketId);
      socket.emit("offer", { to: socketId, offer });
    };
    handleConnection();
  }, [socket, socketId]);

  useEffect(() => {
    if (peer._peer) {
      peer._peer.onconnectionstatechange = () => {
        console.log("Connection state:", peer._peer?.connectionState);
        setState(peer._peer?.connectionState || "");
      };
    }
  }, []);

  useEffect(() => {
    if (state === "disconnected") {
      toast.error("Receiver Disconnected...");
    }
    if (state === "failed") {
      toast.error("Disposing the room...");
      setTimeout(() => {
        navigate("/");
      }, 4000);
    }
  }, [state, navigate]);

  return (
    <div className="mx-auto bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mb-2 flex flex-col gap-2">
        {state === "disconnected" || state === "failed" ? (
          <h1>
            {username} has disconnected from room {roomCode}
          </h1>
        ) : (
          <h1>
            {username} has joined the room {roomCode}
          </h1>
        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">File Upload</h1>
        <p className="text-gray-600">
          Drag and drop your files or click to browse
        </p>
      </div>

      <div
        className={`
          relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02]
          ${
            isDragActive
              ? "border-blue-500 bg-blue-100 shadow-lg scale-[1.02]"
              : files
              ? "border-green-400 bg-green-50 hover:bg-green-100"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
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
                  isDragActive ? "bg-blue-200" : "bg-gray-100"
                }`}
              >
                <Upload
                  className={`w-8 h-8 transition-colors duration-300 ${
                    isDragActive ? "text-blue-600" : "text-gray-500"
                  }`}
                />
              </div>

              {files ? (
                <p className="text-lg font-medium text-green-700">
                  File ready to upload
                </p>
              ) : (
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? "Drop file here" : "Choose or drag a file"}
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

        {isDragActive && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-2xl flex items-center justify-center">
            <div className="text-blue-600 text-xl font-semibold animate-bounce">
              Drop files here!
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <File className="w-5 h-5 mr-2" />
            Selected Files
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2 p-1">
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

      <div className="flex justify-center items-center">
        <button
          onClick={() => {
            handleUploadClick();
            console.log("Upload button clicked");
          }}
          className="mt-6 px-6 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};

export default DragandDrop;
