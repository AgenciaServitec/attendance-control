"use client";

import { useRef, useState } from "react";
import { IconCheck, IconFile, IconUpload, IconX } from "@tabler/icons-react";

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSizeMB?: number;
  shape?: "rectangle" | "circle";
  label?: string;
}

export function FileUploader({
  onUpload,
  accept = "image/jpeg, image/png, image/webp",
  maxSizeMB = 5,
  shape = "rectangle",
  label = "Arrastra y suelta una imagen",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      alert(`El archivo excede los ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);
    setStatus("uploading");

    // Simulación de progreso visual mientras se ejecuta la Server Action
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 90));
    }, 100);

    try {
      await onUpload(selectedFile);
      clearInterval(interval);
      setProgress(100);
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setFile(null);
        setProgress(0);
      }, 3000);
    } catch (error) {
      clearInterval(interval);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Dropzone */}
      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 bg-background"
        } ${shape === "circle" ? "rounded-full aspect-square w-48 mx-auto" : "rounded-2xl p-8"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={accept}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <IconUpload className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-foreground">{label}</span>
            {shape !== "circle" && (
              <span className="text-xs text-muted-foreground">
                Formatos JPG, PNG o WEBP hasta {maxSizeMB}MB.
              </span>
            )}
          </div>
          {shape !== "circle" && (
            <div className="mt-2 px-4 py-1.5 rounded-lg border-2 border-border text-xs font-bold bg-card text-foreground">
              Explorar Archivos
            </div>
          )}
        </div>
      </div>

      {/* Progress Card (Ref: image_7a19df.png) */}
      {file && status !== "idle" && (
        <div className="flex items-center justify-between p-3 rounded-xl border-2 border-border bg-card">
          <div className="flex items-center gap-3 w-full">
            <div className="size-10 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 shrink-0">
              <IconFile className="size-5" />
            </div>
            <div className="flex flex-col flex-1 gap-1.5 mr-4">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="truncate max-w-[200px]">{file.name}</span>
                {status === "success" && (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <IconCheck className="size-3.5" /> Completado
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${status === "success" ? "bg-emerald-500" : "bg-primary"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <IconX className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
