// src/components/ui/FeaturesSection.jsx
import React from 'react';
import { Palette, Wand2, Sparkles, Zap } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">✨ AI Features</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-black/20 rounded-lg">
          <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-gray-300">Style Transfer</p>
        </div>
        <div className="text-center p-4 bg-black/20 rounded-lg">
          <Wand2 className="w-8 h-8 text-pink-400 mx-auto mb-2" />
          <p className="text-sm text-gray-300">Object Removal</p>
        </div>
        <div className="text-center p-4 bg-black/20 rounded-lg">
          <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <p className="text-sm text-gray-300">Enhancement</p>
        </div>
        <div className="text-center p-4 bg-black/20 rounded-lg">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-gray-300">Quick Effects</p>
        </div>
      </div>
    </div>
  );
}
