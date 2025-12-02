import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function EditToolbar({ 
  onSelectTool,
  hasSelection = false 
}) {
  if (!hasSelection) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="bg-white rounded-full shadow-2xl px-3 py-3 flex items-center gap-2 border border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectTool('border')}
          className="rounded-full hover:bg-[#FFF5F0] hover:text-[#FF6B9D]"
        >
          <Palette className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Border</span>
        </Button>
        <div className="w-px h-6 bg-gray-200" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectTool('effect')}
          className="rounded-full hover:bg-[#FFF5F0] hover:text-[#FF6B9D]"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Effect</span>
        </Button>
        <div className="w-px h-6 bg-gray-200" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectTool('size')}
          className="rounded-full hover:bg-[#FFF5F0] hover:text-[#FF6B9D]"
        >
          <Maximize2 className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Size</span>
        </Button>
      </div>
    </motion.div>
  );
}