import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CarImage } from '../types/index.js';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: CarImage[];
  initialIndex?: number;
  carTitle?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  carTitle = 'Vehicle Photos',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-in fade-in duration-200">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full pt-2">
        <div>
          <h4 className="text-base font-bold">{carTitle}</h4>
          <p className="text-xs text-slate-400">
            Photo {currentIndex + 1} of {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* MAIN IMAGE WITH CONTROLS */}
      <div className="relative flex-1 flex items-center justify-center my-4 max-w-6xl mx-auto w-full">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentImg.url}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-[78vh] max-w-full object-contain rounded-xl shadow-2xl"
          referrerPolicy="no-referrer"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* THUMBNAIL STRIP */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-4xl mx-auto">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx ? 'border-red-500 scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
