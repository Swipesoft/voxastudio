import React from 'react';

export default function HeroSection() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Transform Your Photos with
        <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          AI Magic
        </span>
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Upload your image, describe your vision, and watch as AI brings your creative ideas to life
      </p>
    </div>
  );
}
