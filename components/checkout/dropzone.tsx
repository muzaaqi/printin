"use client";
import React, { useCallback, useRef, useState } from "react";

interface FileDropzoneProps {
  onFileSelect: (files: FileList) => void;
  file?: File | null;
  error?: string;
  accept?: string;
  label?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  file,
  error,
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg",
  label = "Upload File",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // Maks 1 file (ambil pertama)
    const dt = new DataTransfer();
    dt.items.add(files[0]);
    onFileSelect(dt.files);
  };

  const onClick = () => {
    inputRef.current?.click();
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const clearFile = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const dt = new DataTransfer();
      onFileSelect(dt.files);
    },
    [onFileSelect]
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        onClick={onClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center rounded-md border border-dashed p-6 text-center cursor-pointer transition 
        ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
        />
        {!file && (
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-semibold">Klik</span> atau drag & drop
            </p>
            <p className="text-xs text-muted-foreground">
              (Maks 1 file • PDF/DOC/Gambar • &lt;= 5MB)
            </p>
          </div>
        )}
        {file && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium truncate max-w-[220px]">
              {file.name}
            </p>
            <button
              onClick={clearFile}
              className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground hover:opacity-90"
            >
              Hapus
            </button>
          </div>
        )}
        <span className="absolute inset-0" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileDropzone;
