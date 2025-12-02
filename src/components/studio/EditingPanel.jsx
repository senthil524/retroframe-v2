import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const borderOptions = [
  { value: 'white', label: 'White', color: '#FFFFFF' },
  { value: 'black', label: 'Black', color: '#2B2B2B' },
  { value: 'cream', label: 'Cream', color: '#F5F1E8' },
  { value: 'pink', label: 'Pink', color: '#FFE5EE' }
];

const effectOptions = [
  { value: 'original', label: 'Original' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'noir', label: 'Noir' },
  { value: 'vivid', label: 'Vivid' },
  { value: 'dramatic', label: 'Dramatic' }
];

const sizeOptions = [
  { value: 'vintage', label: 'Vintage', size: '3.5 × 4.2"', available: true },
  { value: 'mini', label: 'Mini', size: '2 × 3"', available: false },
  { value: 'wide-mini', label: 'Wide Mini', size: '3 × 4"', available: false },
  { value: 'wide', label: 'Wide', size: '4 × 6"', available: false }
];

const effects = {
  original: '',
  vintage: 'sepia-[0.3] contrast-[1.1] brightness-[1.05]',
  noir: 'grayscale contrast-[1.2]',
  vivid: 'saturate-[1.4] contrast-[1.1]',
  dramatic: 'contrast-[1.3] brightness-[0.95]'
};

export default function EditingPanel({ 
  selectedTool,
  onToolChange,
  currentBorder = 'white',
  currentEffect = 'original',
  currentSize = 'vintage',
  onBorderChange,
  onEffectChange,
  onSizeChange,
  previewImage
}) {
  return (
    <AnimatePresence>
      {selectedTool && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Close Button */}
            <button
              onClick={() => onToolChange(null)}
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 text-sm font-medium"
            >
              Close
            </button>

            {/* Tool Title */}
            <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4 capitalize">
              {selectedTool === 'border' && 'Choose Border Color'}
              {selectedTool === 'effect' && 'Choose Photo Effect'}
              {selectedTool === 'size' && 'Choose Print Size'}
            </h3>

            {/* Tool Options */}
            {selectedTool === 'border' && (
              <div className="flex items-center justify-start gap-3 overflow-x-auto pb-2">
                {borderOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onBorderChange(option.value);
                      onToolChange(null);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl transition-all flex-shrink-0",
                      currentBorder === option.value 
                        ? "bg-[#FFF5F0] ring-2 ring-[#FF6B9D]" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div 
                      className="w-16 h-16 rounded-xl shadow-md border-2 border-gray-200"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {selectedTool === 'effect' && (
              <div className="flex items-center justify-start gap-3 overflow-x-auto pb-2">
                {effectOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onEffectChange(option.value);
                      onToolChange(null);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl transition-all flex-shrink-0",
                      currentEffect === option.value 
                        ? "bg-[#FFF5F0] ring-2 ring-[#FF6B9D]" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    {/* Preview Image with Effect */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md bg-gray-100">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt={option.label}
                          className={cn('w-full h-full object-cover', effects[option.value])}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {selectedTool === 'size' && (
              <div className="flex items-center justify-start gap-3 overflow-x-auto pb-2">
                {sizeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (option.available) {
                        onSizeChange(option.value);
                        onToolChange(null);
                      }
                    }}
                    disabled={!option.available}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl transition-all min-w-[120px] flex-shrink-0",
                      option.available
                        ? currentSize === option.value
                          ? "bg-[#FFF5F0] ring-2 ring-[#FF6B9D]"
                          : "hover:bg-gray-50"
                        : "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <span className="text-base font-semibold text-gray-700">{option.label}</span>
                    <span className="text-sm text-gray-500">{option.size}</span>
                    {!option.available && (
                      <span className="text-xs text-[#FF6B9D] font-medium">Coming Soon</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}