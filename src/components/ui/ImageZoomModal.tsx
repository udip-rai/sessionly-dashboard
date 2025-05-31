import React, { useState, useEffect } from "react";
import { FiX, FiZoomIn, FiZoomOut, FiRotateCw } from "react-icons/fi";

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  userName?: string;
}

export function ImageZoomModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  userName,
}: ImageZoomModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom((prev) => Math.max(0.5, Math.min(5, prev + delta)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold">
            {userName ? `${userName}'s Profile Picture` : "Profile Picture"}
          </h3>
          <p className="text-sm text-gray-300">
            Use scroll wheel or buttons to zoom • Drag to pan
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-xl px-4 py-2">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <FiZoomOut className="w-5 h-5" />
        </button>

        <div className="text-white text-sm min-w-[60px] text-center font-medium">
          {Math.round(zoom * 100)}%
        </div>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 5}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <FiZoomIn className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-white/30 mx-2" />

        <button
          onClick={handleRotate}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
          title="Rotate"
        >
          <FiRotateCw className="w-5 h-5" />
        </button>
      </div>

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-full object-contain select-none transition-transform duration-200 ease-out shadow-2xl"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${
              position.x / zoom
            }px, ${position.y / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          draggable={false}
        />
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
