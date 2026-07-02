import { useId, useRef, useState } from "react";
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
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<XMLHttpRequest | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [failedFile, setFailedFile] = useState<File | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const hasCloudinary = !!(cloudName && uploadPreset);

  const processFile = async (file: File) => {
    setError("");
    setFailedFile(null);
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      setError("Choose a supported image or video file.");
      return;
    }
    if ((accept === "image" && !isImage) || (accept === "video" && !isVideo)) {
      setError(`This memory needs ${accept === "image" ? "an image" : "a video"}.`);
      return;
    }
    const maxBytes = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`${isVideo ? "Videos" : "Images"} must be smaller than ${isVideo ? "100 MB" : "15 MB"}.`);
      return;
    }
    const type: "image" | "video" = isVideo ? "video" : "image";

    if (!hasCloudinary) {
      setError("Media uploads are not configured yet. You can still save this memory without media.");
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
        requestRef.current = xhr;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90));
        };
        xhr.onload = () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(new Error("The media service rejected this upload."));
            return;
          }
          try {
            const parsed = JSON.parse(xhr.responseText) as { secure_url?: string };
            if (!parsed.secure_url) throw new Error("Missing media URL");
            setProgress(100);
            resolve({ secure_url: parsed.secure_url });
          } catch { reject(new Error("The media service returned an invalid response.")); }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));
        xhr.timeout = 120_000;
        xhr.ontimeout = () => reject(new Error("Upload timed out"));
        xhr.open("POST", url);
        xhr.send(formData);
      });

      onChange(result.secure_url, type);
      setFailedFile(null);
    } catch (err) {
      setFailedFile(file);
      setError(err instanceof DOMException && err.name === "AbortError" ? "Upload cancelled." : "Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      requestRef.current = null;
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
    onChange("", mediaType);
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={handleFileChange}
        id={inputId}
        aria-label="Choose a photo or video"
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
                <button type="button" onClick={() => requestRef.current?.abort()} className="mt-3 min-h-11 px-4 rounded-full bg-white text-bloom-dark shadow-sm">
                  Cancel upload
                </button>
              </div>
            )}

            {/* Actions */}
            {!uploading && (
              <div className="absolute top-2 right-2 flex gap-1.5">
                <label
                  htmlFor={inputId}
                  className="w-11 h-11 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-white transition-colors"
                  aria-label="Replace media"
                >
                  <Camera size={15} className="text-bloom-dark" />
                </label>
                <button
                  type="button"
                  onClick={clear}
                  className="w-11 h-11 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                  aria-label="Remove media"
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
            htmlFor={inputId}
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
        <p className="font-caveat text-sm text-red-500 mt-1 text-center" role="alert">{error}</p>
      )}
      {failedFile && !uploading && (
        <button type="button" onClick={() => void processFile(failedFile)} className="mx-auto mt-2 min-h-11 px-5 rounded-full bg-bloom-pink-light text-bloom-dark font-lato text-sm font-bold flex items-center gap-2">
          <Upload size={16} aria-hidden="true" /> Retry upload
        </button>
      )}
    </div>
  );
}
