import { useRef, useState } from "react";
import { Camera, Video, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  value?: string;
  mediaType?: "image" | "video";
  onChange: (url: string, type: "image" | "video") => void;
  onClear?: () => void;
  accept?: "image" | "video" | "both";
  className?: string;
}

export function FileUpload({
  value,
  mediaType = "image",
  onChange,
  onClear,
  accept = "both",
  className = "",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const hasCloudinary = !!(cloudName && uploadPreset);

  const processFile = async (file: File) => {
    setError("");
    const isVideo = file.type.startsWith("video/");
    const type: "image" | "video" = isVideo ? "video" : "image";

    if (!hasCloudinary) {
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl, type);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "bloombook");

      const resourceType = isVideo ? "video" : "image";
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90));
        };
        xhr.onload = () => {
          setProgress(100);
          try { resolve(JSON.parse(xhr.responseText)); }
          catch { reject(new Error("Invalid response")); }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("POST", url);
        xhr.send(formData);
      });

      onChange(result.secure_url, type);
    } catch (err) {
      setError("Upload failed. Try again?");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const acceptAttr =
    accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*";

  const clear = () => {
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
    onChange("", "image");
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={handleFileChange}
        id="file-upload-input"
      />

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="relative rounded-[18px] overflow-hidden shadow-[0_4px_20px_rgba(242,196,206,0.25)]"
          >
            {mediaType === "video" ? (
              <video
                src={value}
                className="w-full h-52 object-cover"
                controls
                playsInline
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-52 object-cover"
              />
            )}

            {/* Uploading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#F2C4CE" strokeWidth="4" />
                    <circle
                      cx="28" cy="28" r="24" fill="none" stroke="#E8A0B0" strokeWidth="4"
                      strokeDasharray={`${(progress / 100) * 150.8} 150.8`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-caveat text-bloom-pink-deep text-lg">
                    {progress}%
                  </span>
                </div>
                <p className="font-caveat text-bloom-soft mt-2">uploading...</p>
              </div>
            )}

            {/* Actions */}
            {!uploading && (
              <div className="absolute top-2 right-2 flex gap-1.5">
                <label
                  htmlFor="file-upload-input"
                  className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-white transition-colors"
                >
                  <Camera size={15} className="text-bloom-dark" />
                </label>
                <button
                  type="button"
                  onClick={clear}
                  className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <X size={15} className="text-bloom-dark" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            htmlFor="file-upload-input"
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-40 rounded-[18px] border-2 border-dashed cursor-pointer transition-all duration-200 select-none
              ${dragOver
                ? "border-bloom-pink-deep bg-bloom-pink-light/40 scale-[1.01]"
                : "border-bloom-pink-light bg-bloom-pink-light/15 hover:bg-bloom-pink-light/30"
              }`}
          >
            <motion.div
              animate={dragOver ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="mb-3 flex gap-2"
            >
              {(accept === "both" || accept === "image") && (
                <Camera size={26} className="text-bloom-pink-deep/70" />
              )}
              {(accept === "both" || accept === "video") && (
                <Video size={26} className="text-bloom-pink-deep/70" />
              )}
              {accept === "both" && <Upload size={22} className="text-bloom-pink-deep/40 self-end" />}
            </motion.div>
            <span className="font-caveat text-[19px] text-bloom-soft">
              {dragOver ? "drop it right here!" : "tap to add a photo or video"}
            </span>
            <span className="font-lato text-[11px] text-bloom-soft/50 mt-1 uppercase tracking-wide">
              or drag & drop
            </span>
          </motion.label>
        )}
      </AnimatePresence>

      {error && (
        <p className="font-caveat text-sm text-red-400 mt-1 text-center">{error}</p>
      )}
    </div>
  );
}
