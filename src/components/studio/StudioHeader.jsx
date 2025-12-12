import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function StudioHeader({
  photoCount = 0,
  totalAmount = 0,
  onCartClick
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between relative">
          {/* Centered Logo - no animation for instant render */}
          <div
            className="text-2xl md:text-3xl text-brand-dark"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            RetroFrame
          </div>

          {/* Cart Button - no animation for instant interactivity */}
          <div className="absolute right-4 md:relative md:right-auto">
            <Button
              onClick={onCartClick}
              disabled={photoCount === 0}
              className={cn(
                "rounded-full shadow-lg transition-all duration-300 font-semibold relative",
                "px-4 py-2.5 md:px-6 md:py-3",
                photoCount > 0
                  ? "bg-brand-coral text-white hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
              style={photoCount > 0 ? { background: 'var(--color-coral)' } : {}}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 md:w-5 md:h-5 md:mr-1" />
                <span className="md:hidden text-sm font-bold">{photoCount}</span>
                <span className="hidden md:inline whitespace-nowrap">
                  {photoCount} {photoCount === 1 ? 'item' : 'items'} • ₹{totalAmount}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}