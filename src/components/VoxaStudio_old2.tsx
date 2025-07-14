"use client"; 

// Import neccessary libraries and packages 
import React, { useState, useRef } from 'react';
import {Sparkles, Zap} from 'lucide-react'; 

// Import sections from the components directory 
import Header from './sections/Header';
import HeroSection  from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSelection';
import PromptSection from './sections/PromptSection';
import ResultSection from './sections/ResultSection';   
import UploadSection from './sections/UploadSection';
import Footer from './sections/Footer';

// Main component for VoxaStudio 
export default function VoxaStudio() {
  // State variables for image handling and processing
  const [selectedImage, setSelectedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);

  // Ref for the hidden file input element
  const fileInputRef = useRef(null);

  /**
   * Handles the image file selection from the input.
   * Reads the file as a Data URL and sets it as the selected image.
   * Resets the processed image state.
   * @param {Event} event - The change event from the file input.
   */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setProcessedImage(null); // Clear processed image when a new one is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Simulates the image processing. In a real application, this would
   * involve making an API call to an AI model.
   * Sets processing state, simulates delay, then sets a processed image.
   */
  const handleProcess = async () => {
    // Prevent processing if no image is selected or prompt is empty
    if (!selectedImage || !prompt.trim()) {
      console.log("Please select an image and enter a prompt.");
      return;
    }

    setIsProcessing(true); // Set processing state to true

    try {
      // Placeholder for actual API call to your AI model
      // Example:
      // const response = await fetch('/api/process-image', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ image: selectedImage, prompt: prompt })
      // });
      // const data = await response.json();
      // setProcessedImage(data.processedImageUrl);

      // Simulate a network request delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // For demonstration, just set the processed image to the selected image
      // Replace this with the actual image returned from your AI model
      setProcessedImage(selectedImage);

    } catch (error) {
      console.error("Error processing image:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  /**
   * Prevents default drag-over behavior to allow dropping.
   * @param {Event} e - The drag event.
   */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /**
   * Handles image file drop events.
   * Reads the dropped file as a Data URL if it's an image.
   * @param {Event} e - The drop event.
   */
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setProcessedImage(null); // Clear processed image when a new one is dropped
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

        {/* Main Interface Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Upload and Prompt Sections */}
          <div className="space-y-6">
            {/* Upload Section Component */}
            <UploadSection
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              setProcessedImage={setProcessedImage}
              fileInputRef={fileInputRef}
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
              disabled={!selectedImage || !prompt.trim() || isProcessing}
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

