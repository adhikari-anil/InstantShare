import { useSocket } from "@/context/socketContext";
import peer from "@/services/peer";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";

const FileView = ({ room }: { room: string }) => {
  const [senderId, setSenderId] = useState("");
  const socket = useSocket();
  const [state, setState] = useState("disconnected");
  const [downloadLink, setUrl] = useState<string>();
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  useEffect(() => {
    // set up data channel handler
    peer.onDataChannel = (channel) => {
      let receivedBuffers: ArrayBuffer[] = [];
      let fileMeta: {
        name: string;
        size: number;
        totalChunks: number;
        mime: string;
      } | null = null;
      let receivedChunkCount = 0;

      channel.onmessage = (event) => {
        if (typeof event.data === "string") {
          try {
            const message = JSON.parse(event.data);

            if (message.type === "file-meta") {
              fileMeta = {
                name: message.name,
                size: message.size,
                totalChunks: message.totalChunks,
                mime: message.mime,
              };

              receivedBuffers = [];
              receivedChunkCount = 0;

              console.log(
                `Receiving file: ${fileMeta.name}, size: ${fileMeta.size}, chunks: ${fileMeta.totalChunks}`
              );
            }
          } catch (err) {
            console.error("Failed to parse metadata:", err);
          }
        } else {
          // Binary data chunk
          receivedBuffers.push(event.data);
          receivedChunkCount++;

          if (fileMeta) {
            console.log(
              `Received ${receivedChunkCount}/${fileMeta.totalChunks} chunks`
            );

            if (receivedChunkCount === fileMeta.totalChunks) {
              const blob = new Blob(receivedBuffers);
              const url = URL.createObjectURL(blob);

              console.log("File received completely:", fileMeta.name, url);
              setUrl(url);
              setFileName(fileMeta.name);
              setFileType(fileMeta.mime);

              // Reset
              fileMeta = null;
              receivedBuffers = [];
              receivedChunkCount = 0;
            }
          }
        }
      };
      channel.onopen = () => {
        console.log("Data channel opened from receiver's side...");
      };
      peer.dataChannel = channel;
    };

    const handleIncommingOffer = async ({
      from,
      offer,
    }: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log("Receiver offer: ", offer);
      setSenderId(from);
      const answer = await peer.getAnswer(offer);
      socket.emit("answer", { to: from, answer: answer });
    };

    // ICE Candidate handler..
    const handleIceCandidate = async ({
      candidate,
    }: {
      candidate: RTCIceCandidate;
    }) => {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    };

    //gathering ICE candidate in receiver's end...
    peer.onIceCandidate((candidate) => {
      if (senderId) {
        socket.emit("ice-candidate", {
          to: senderId,
          candidate: candidate.toJSON(),
        });
      }
    });

    console.log("Socket le listen garxa");
    socket.on("incomming-offer", handleIncommingOffer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("incomming-offer", handleIncommingOffer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [senderId, socket]);

  useEffect(() => {
    if (peer._peer) {
      peer._peer.onconnectionstatechange = () => {
        console.log("Connection state:", peer._peer?.connectionState);
        setState(peer._peer?.connectionState ?? "disconnected");
      };
    }
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {downloadLink ? (
        <div className="flex flex-col text-center gap-5">
          <h1>
            {state === "connected" ? `Connected to Room: ${room} 🟢` : `Disconnected from Room: ${room} ❌`}
          </h1>
          <h3>Preview: {fileName}</h3>

          {fileType.startsWith("image/") && (
            <img
              src={downloadLink}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 400 }}
            />
          )}

          {fileType.startsWith("video/") && (
            <div className="flex justify-center">
              <video src={downloadLink} controls height={300} width={300} />
            </div>
          )}

          {fileType.startsWith("audio/") && (
            <audio src={downloadLink} controls />
          )}

          {fileType === "application/pdf" && (
            <iframe
              src={downloadLink}
              style={{ width: "80%", height: "200px" }}
            />
          )}

          {!fileType.startsWith("image/") &&
            !fileType.startsWith("audio/") &&
            !fileType.startsWith("video/") &&
            fileType !== "application/pdf" && (
              <p>Cannot preview this file type. You can still download it.</p>
            )}

          <div className="flex justify-center">
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = downloadLink;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              className="bg-blue-600 p-2 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors duration-200 font-medium w-1/2"
            >
              Download
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <h1>
            Connected to Room: {room} {state === "connected" ? "🟢" : "❌"}
          </h1>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default FileView;
