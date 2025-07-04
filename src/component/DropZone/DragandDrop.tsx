import React, { useState, useRef } from "react";
import { Upload, File, X, Check } from "lucide-react";

const DragandDrop = ({ roomCode }: { roomCode: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success"
  >("idle");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
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

  const handleUploadClick = () => {
    if (files.length === 0) {
      alert("Please select files to upload.");
      return;
    }
    simulateUpload();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const simulateUpload = () => {
    setUploadStatus("uploading");
    setTimeout(() => {
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 2000);
    }, 1500);
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

  return (
    <div className="mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mb-8 flex flex-col gap-4">
        <h1>Room Code: {roomCode}</h1>
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
              : files.length > 0
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

              {files.length === 0 ? (
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {isDragActive
                      ? "Drop files here"
                      : "Choose files or drag them here"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Support for multiple file types
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-green-700 mb-2">
                    {files.length} file{files.length !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-sm text-gray-500">
                    Click to add more files
                  </p>
                </div>
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
            Selected Files ({files.length})
          </h3>

          <div className="space-y-3">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-2xl">{getFileIcon(file.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setFiles([])}
              className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
            >
              Clear All Files
            </button>
          </div>
        </div>
      )}
      <div className="mt-8 flex justify-center items-center">
        <button
          onClick={handleUploadClick}
          className="mt-6 px-6 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};

export default DragandDrop;
