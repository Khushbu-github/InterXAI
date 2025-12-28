import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ImageUploader({ onUploadSuccess, label = "Upload Image", maxSizeMB = 5 }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image size should not exceed ${maxSizeMB}MB.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: `upload_${file.name}`,
      keyvalues: { uploaded_at: new Date().toISOString() },
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", options);

    try {
      setUploading(true);
      toast.info("Uploading image...");

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT_TOKEN}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.IpfsHash) {
        const imageUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        toast.success("Image uploaded successfully!");
        if (onUploadSuccess) onUploadSuccess(imageUrl);
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-700 file:text-white hover:file:bg-slate-600 file:cursor-pointer"
        disabled={uploading}
      />
      {uploading && (
        <div className="flex items-center gap-1 text-blue-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
        </div>
      )}
    </div>
  );
}
