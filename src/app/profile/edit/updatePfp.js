"use client";

import Image from "next/image";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const UpdatePfp = ({ userData, pfp, setPfp }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleClose = () => {
    setPfp(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const base64Image = await convertToBase64(selectedFile);

      const res = await fetch("/api/profile/edit/pfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      window.location.reload();

      handleClose();

    } catch (err) {
      console.error(err);
      setError("Failed to upload. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!pfp) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-3xl ">
      <div className="bg-gradient-to-b from-slate-200 to-slate-50 rounded-lg p-6 max-w-md w-full shadow-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-3 text-gray-500 hover:text-gray-800"
        >
          <IoMdClose size={30}/>
        </button>

        <h2 className="text-xl font-semibold mb-4">Update Profile Picture</h2>

        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
            <Image
              src={
                previewUrl ||
                userData?.image ||
                "https://via.placeholder.com/150"
              }
              width={150}
              height={150}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-gray-600 to-gray-900 rounded-full flex text-white p-2 justify-center items-center gap-3 px-5 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePfp;
