import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function PhotoUploader({ onUpload, uploading = false }) {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 md:p-20 transition-all duration-300 cursor-pointer",
          dragActive 
            ? "border-[#FF6B9D] bg-[#FFF5F0] scale-[1.02]" 
            : "border-gray-200 hover:border-[#FF6B9D] hover:bg-[#FFFAF8]",
          uploading && "opacity-50 pointer-events-none"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-center">
          <motion.div
            animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
            className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-[#FFF5F0] rounded-full flex items-center justify-center"
          >
            {uploading ? (
              <div className="w-10 h-10 border-4 border-[#FF6B9D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-10 h-10 md:w-12 md:h-12 text-[#FF6B9D]" />
            )}
          </motion.div>

          <h3 className="text-2xl md:text-3xl font-bold text-[#2B2B2B] mb-3">
            {uploading ? 'Uploading...' : 'Upload Your Photos'}
          </h3>
          
          <p className="text-base md:text-lg text-gray-500 mb-6">
            Drag & drop or click to select
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>JPG, PNG</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>Max 10MB each</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}