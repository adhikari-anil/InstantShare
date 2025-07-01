import { useState } from "react";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const api = import.meta.env.VITE_BACKEND_URL;
  console.log(api);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage("Please select a file..");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${api}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("File Uploaded Successfully..");
        console.log("Upload message", data);
      } else {
        const errorText = await response.text();
        setMessage(`Upload Failed: ${errorText}`);
      }
    } catch (error) {
      console.log("Error while uploading..", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleChange} />
        <button type="submit"> Upload </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadForm;
