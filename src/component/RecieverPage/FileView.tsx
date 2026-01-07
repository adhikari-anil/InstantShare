import { useSocket } from "@/context/socketContext";
import peer from "@/services/peer";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ReceivedFile {
  name: string;
  size: number;
  mime: string;
  blob: Blob;
  progress: number;
  totalChunks: number;
}

const FileView = ({ room }: { room: string }) => {
  const [senderId, setSenderId] = useState("");
  const socket = useSocket();
  const [state, setState] = useState("");
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const navigate = useNavigate();

  console.log("Received files: ", receivedFiles);

  useEffect(() => {
    peer.onDataChannel = (channel) => {
      let buffers: ArrayBuffer[] = [];
      let fileMeta: ReceivedFile | null = null;
      let chunkCount = 0;

      channel.onmessage = (event) => {
        if (typeof event.data === "string") {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "file-meta") {
              fileMeta = {
                name: msg.name,
                size: msg.size,
                mime: msg.mime,
                blob: new Blob([]),
                progress: 0,
                totalChunks: msg.totalChunks ?? 1,
              };
              buffers = [];
              chunkCount = 0;
              console.log(
                `Receiving file: ${fileMeta.name}, size: ${fileMeta.size}, chunks: ${msg.totalChunks}`
              );
            }
          } catch (err) {
            console.error("Failed to parse metadata:", err);
          }
        } else {
          // binary chunk
          buffers.push(event.data);
          chunkCount++;

          if (fileMeta) {
            console.log("ChunkCount: ", chunkCount);
            console.log("File Size: ", fileMeta.size);
            const recievedBytes = buffers.reduce(
              (a, b) => a + (b as ArrayBuffer).byteLength,
              0
            );
            fileMeta.progress = (recievedBytes / fileMeta.size) * 100;
            console.log("Progress: ", fileMeta.progress);
            console.log("filemeta check: ", fileMeta);
            if (
              chunkCount === fileMeta.totalChunks ||
              recievedBytes >= fileMeta.size
            ) {
              const completedFile = {
                ...fileMeta,
                blob: new Blob(buffers, { type: fileMeta.mime }),
              };
              console.log("Complete file: ", completedFile);
              setReceivedFiles((prev) => [...prev, completedFile]);
              fileMeta = null;
              buffers = [];
              chunkCount = 0;
            }
          }
        }
      };

      channel.onopen = () =>
        console.log("Data channel opened from receiver's side...");
      peer.dataChannel = channel;
    };

    const handleIncommingOffer = async ({
      from,
      offer,
    }: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      setSenderId(from);
      const answer = await peer.getAnswer(offer);
      socket.emit("answer", { to: from, answer: answer });
    };

    const handleIceCandidate = async ({
      candidate,
    }: {
      candidate: RTCIceCandidate;
    }) => {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    };

    peer.onIceCandidate((candidate) => {
      if (senderId) {
        socket.emit("ice-candidate", {
          to: senderId,
          candidate: candidate.toJSON(),
        });
      }
    });

    socket.on("incomming-offer", handleIncommingOffer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("incomming-offer", handleIncommingOffer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [senderId, socket]);

  useEffect(() => {
    if (peer._peer) {
      peer._peer.onconnectionstatechange = () =>
        setState(peer._peer?.connectionState ?? "");
    }
  }, []);

  useEffect(() => {
    if (state === "disconnected") toast.error("Sender Disconnect!");
    if (state === "failed") {
      toast.error("Room closed. Redirecting to homepage!");
      setTimeout(() => navigate("/"), 4000);
    }
  }, [state, navigate]);

  return (
    <div className="flex flex-col gap-5">
      <h1>
        {state === "connected"
          ? `Connected to Room: ${room} 🟢`
          : `Disconnected from Room: ${room} ❌`}
      </h1>

      {receivedFiles.length === 0 && (
        <div className="flex flex-col gap-6 items-center">
          <Loading />
          <p className="text-lg text-center">Waiting for sender to upload...</p>
        </div>
      )}

      {receivedFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[600px] overflow-y-auto p-2">
          {receivedFiles.map((file, idx) =>
            file ? (
              <div
                key={idx}
                className="flex flex-col justify-between items-center gap-2 border p-4 rounded-xl bg-white shadow-sm"
              >
                <h3 className="font-semibold w-full sm:w-50 overflow-hidden">
                  <span className="inline-block whitespace-nowrap animate-marquee">
                    {file.name}
                  </span>
                </h3>
                <div className="h-60 w-full flex items-center justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded cursor-pointer hover:bg-muted/30 transition">
                        {/* IMAGE */}
                        {file.mime.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(file.blob)}
                            alt={file.name}
                            className="max-w-full max-h-60 object-contain"
                          />
                        )}

                        {/* VIDEO */}
                        {file.mime.startsWith("video/") && (
                          <video
                            src={URL.createObjectURL(file.blob)}
                            className="max-w-full max-h-60 pointer-events-none"
                          />
                        )}

                        {/* PDF */}
                        {file.mime === "application/pdf" && (
                          <iframe
                            src={URL.createObjectURL(file.blob)}
                            className="w-4/5 h-48 pointer-events-none"
                          />
                        )}

                        {/* FALLBACK */}
                        {!(
                          file.mime.startsWith("image/") ||
                          file.mime.startsWith("video/") ||
                          file.mime === "application/pdf"
                        ) && (
                          <div className="text-muted-foreground text-sm">
                            Preview not available
                          </div>
                        )}
                      </div>
                    </DialogTrigger>
                    <DialogContent className="!fixed !inset-0 !left-0 !top-0 !translate-x-0 !translate-y-0 !w-[100dvw] !h-[100dvh] !max-w-none !max-h-none !rounded-none p-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden p-4">
                        {/* IMAGE */}
                        {file.mime.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(file.blob)}
                            alt={file.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        )}

                        {/* VIDEO */}
                        {file.mime.startsWith("video/") && (
                          <video
                            src={URL.createObjectURL(file.blob)}
                            controls
                            autoPlay
                            className="max-w-full max-h-full object-contain"
                          />
                        )}

                        {/* PDF */}
                        {file.mime === "application/pdf" && (
                          <div className="w-full h-full bg-black">
                            <iframe
                              src={`${URL.createObjectURL(
                                file.blob
                              )}#zoom=page-fit`}
                              className="w-full h-full border-0"
                            />
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(file.blob);
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }}
                  className="bg-blue-600 p-2 text-white rounded-lg hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default FileView;
