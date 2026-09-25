import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react';

export interface FileUploaderProps {
  label?: string;
  helperText?: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect?: (file: File) => void;
  isLoading?: boolean;
  uploadProgress?: number;
  error?: string;
  successMessage?: string;
  previewUrl?: string | null;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label = 'Upload Document / File',
  helperText = 'PDF, PNG, JPG up to 10MB',
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSizeMB = 10,
  onFileSelect,
  isLoading = false,
  uploadProgress = 0,
  error,
  successMessage,
  previewUrl,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSet = (file: File) => {
    setLocalError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size exceeds maximum allowed size (${maxSizeMB}MB)`);
      return;
    }
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSet(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setLocalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeError = error || localError;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#0B1F4D] uppercase tracking-wider">
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
          dragActive
            ? 'border-[#155EEF] bg-[#EEF4FF]/50 scale-[1.01]'
            : 'border-[#DCE5F2] bg-white hover:border-[#155EEF] hover:bg-[#F8FAFD]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {/* Upload Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] border border-[#DCE5F2] text-[#155EEF] flex items-center justify-center mb-3 shadow-2xs">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-bold text-[#0B1F4D]">
          Click to upload <span className="font-normal text-[#5B6B82]">or drag and drop</span>
        </p>
        <p className="text-xs text-[#5B6B82] mt-1">{helperText}</p>

        {/* Selected file preview pill or image preview */}
        {previewUrl && !selectedFile && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 p-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl flex items-center gap-2 text-xs text-[#0B1F4D]"
          >
            <ImageIcon className="w-4 h-4 text-[#155EEF]" />
            <img src={previewUrl} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-[#DCE5F2]" />
            <span className="text-[11px] text-[#5B6B82]">Current file preview</span>
          </div>
        )}

        {selectedFile && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 px-3.5 py-2 bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl flex items-center gap-2.5 text-xs text-[#0B1F4D] font-medium"
          >
            <File className="w-4 h-4 text-[#155EEF] flex-shrink-0" />
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
            <span className="text-[#8A9BB0] text-[11px]">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[#8A9BB0] hover:text-red-600 transition-colors ml-1 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {isLoading && (
          <div className="w-full max-w-xs mt-4">
            <div className="h-1.5 w-full bg-[#DCE5F2] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#155EEF] to-[#00B8F8] transition-all duration-300"
                style={{ width: `${uploadProgress || 100}%` }}
              />
            </div>
            <p className="text-[11px] text-[#5B6B82] mt-1 font-semibold">
              Uploading... {uploadProgress ? `${uploadProgress}%` : ''}
            </p>
          </div>
        )}
      </div>

      {/* Error state */}
      {activeError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      {/* Success state */}
      {successMessage && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
