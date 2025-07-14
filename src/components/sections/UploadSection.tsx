/* eslint-disable @next/next/no-img-element */
// src/components/ui/UploadSection.jsx
import React from 'react';
import { Upload, FileImage } from 'lucide-react';

interface UploadSectionProps {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  setProcessedImage: (image: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement| null>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}

export default function UploadSection({
  selectedImage,
  setSelectedImage,
  setProcessedImage,
  fileInputRef,
  handleImageUpload,
  handleDragOver,
  handleDrop,
}: UploadSectionProps ) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        Upload Your Image
      </h3>

      <div
        className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedImage ? (
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt="Uploaded"
              className="max-h-64 mx-auto rounded-lg shadow-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the file input click
                setSelectedImage(null);
                setProcessedImage(null); // Clear processed image if original is removed
              }}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Choose different image
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <FileImage className="w-12 h-12 text-purple-400 mx-auto" />
            <div>
              <p className="text-white font-medium">Drop your image here</p>
              <p className="text-gray-400">or click to browse</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
