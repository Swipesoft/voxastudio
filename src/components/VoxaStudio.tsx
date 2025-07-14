"use client"; 

// Import neccessary libraries and packages 
import React, { useState, useRef } from 'react';
import { Zap, AlertCircle } from 'lucide-react'; 

// Import sections from the components directory 
import Header from './sections/Header';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSelection';
import PromptSection from './sections/PromptSection';
import ResultSection from './sections/ResultSection';   
import UploadSection from './sections/UploadSection';
import Footer from './sections/Footer';

// Main component for VoxaStudio 
export default function VoxaStudio() {
  // State variables for image handling and processing
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAPIKey, setUserAPIKey] = useState<string>('');

  // Ref for the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the image file selection from the input.
   * Reads the file as a Data URL and sets it as the selected image.
   * Resets the processed image state.
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Processes the image using the API endpoint.
   * Uploads the image and prompt to the backend for AI processing.
   */
  const handleProcess = async () => {
    // Prevent processing if no file is selected or prompt is empty
    if (!selectedFile || !prompt.trim()) {
      setError("Please select an image and enter a prompt.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create FormData to send file and prompt
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('prompt', prompt);
      if (userAPIKey.trim()) {
        formData.append('userAPIKey', userAPIKey);
      }

      // Make API call to process the image
      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      if (data.success) {
        setProcessedImage(data.processedImageUrl);
      } else {
        throw new Error(data.error || 'Failed to process image');
      }

    } catch (error) {
      console.error("Error processing image:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Prevents default drag-over behavior to allow dropping.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /**
   * Handles image file drop events.
   * Reads the dropped file as a Data URL if it's an image.
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Predefined prompt suggestions for user convenience
  const promptSuggestions = [
    "Remove the background",
    "Add dramatic lighting",
    "Make it look like a painting",
    "Change the sky to sunset",
    "Add motion blur effect",
    "Convert to black and white"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter">
      {/* Animated background elements for visual flair */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header Component */}
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Component */}
        <HeroSection />

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* API Key Input */}
        <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">API Configuration (Optional)</h3>
          <input
            type="password"
            value={userAPIKey}
            onChange={(e) => setUserAPIKey(e.target.value)}
            placeholder="Enter your Together AI API key (optional - for higher limits)"
            className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-400 mt-2">
            Without an API key,you&apos;ll be limited to 10 requests per day. Get your API key from{' '}
            <a href="https://together.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
              together.ai
            </a>
          </p>
        </div>

        {/* Main Interface Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Upload and Prompt Sections */}
          <div className="space-y-6">
            {/* Upload Section Component */}
            <UploadSection
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              setProcessedImage={setProcessedImage}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              handleImageUpload={handleImageUpload}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
            />

            {/* Prompt Section Component */}
            <PromptSection
              prompt={prompt}
              setPrompt={setPrompt}
              promptSuggestions={promptSuggestions}
            />

            {/* Process Button */}
            <button
              onClick={handleProcess}
              disabled={!selectedFile || !prompt.trim() || isProcessing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Transform Image</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Result and Features Sections */}
          <div className="space-y-6">
            {/* Result Section Component */}
            <ResultSection processedImage={processedImage} />

            {/* Features Section Component */}
            <FeaturesSection />
          </div>
        </div>

        {/* Footer Component */}
        <Footer />
      </main>
    </div>
  );
}