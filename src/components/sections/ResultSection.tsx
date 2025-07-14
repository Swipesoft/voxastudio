// src/components/ui/ResultSection.jsx
import React from 'react';
import { Sparkles, Download, Camera } from 'lucide-react';

export default function ResultSection({ processedImage }) {
  // Function to handle image download
  const handleDownload = () => {
    if (processedImage) {
      // Build same-origin download URL
      const downloadUrl = `/api/download-image?url=${encodeURIComponent(processedImage)}`;
      const link = document.createElement('a');
      link.href = downloadUrl; //processedImage;
      link.download = 'voxastudio-transformed-image.png'; // You can make this a dynamic hint for desktop
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2" />
        AI Generated Result
      </h3>

      <div className="aspect-square bg-black/20 rounded-xl flex items-center justify-center border border-white/10">
        {processedImage ? (
          <div className="space-y-4 text-center">
            <img
              src={processedImage}
              alt="Processed"
              className="max-h-96 mx-auto rounded-lg shadow-lg"
            />
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <Camera className="w-16 h-16 text-gray-500 mx-auto" />
            <p className="text-gray-400">Your transformed image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
