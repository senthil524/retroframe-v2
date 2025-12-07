import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom 404 SVG illustration
const NotFoundIllustration = () => (
  <svg
    width="280"
    height="200"
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    {/* Polaroid frame 1 - tilted left */}
    <g transform="rotate(-12 80 100)">
      <rect x="30" y="40" width="100" height="120" rx="4" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"/>
      <rect x="40" y="50" width="80" height="80" rx="2" fill="#FFF5F0"/>
      <text x="80" y="95" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#FF6B6B">4</text>
    </g>

    {/* Polaroid frame 2 - center */}
    <g transform="translate(90, 20)">
      <rect x="0" y="0" width="100" height="120" rx="4" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"/>
      <rect x="10" y="10" width="80" height="80" rx="2" fill="#FFF5F0"/>
      <text x="50" y="55" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#FF6B6B">0</text>
    </g>

    {/* Polaroid frame 3 - tilted right */}
    <g transform="rotate(12 200 100)">
      <rect x="150" y="40" width="100" height="120" rx="4" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"/>
      <rect x="160" y="50" width="80" height="80" rx="2" fill="#FFF5F0"/>
      <text x="200" y="95" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#FF6B6B">4</text>
    </g>

    {/* Decorative elements */}
    <circle cx="40" cy="180" r="4" fill="#FF6B6B" opacity="0.5"/>
    <circle cx="240" cy="180" r="4" fill="#FF6B6B" opacity="0.5"/>
    <circle cx="140" cy="170" r="3" fill="#FF6B6B" opacity="0.3"/>
  </svg>
);

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-warm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <NotFoundIllustration />

        <h1
          className="text-3xl md:text-4xl font-normal text-brand-dark mt-8 mb-3"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Page Not Found
        </h1>

        <p className="text-brand-secondary mb-8 text-base">
          Looks like this memory got lost! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button
              variant="outline"
              className="rounded-full px-6 w-full sm:w-auto border-brand-coral text-brand-coral hover:bg-brand-coral/5"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/studio">
            <Button
              className="rounded-full px-6 w-full sm:w-auto text-white"
              style={{ backgroundColor: 'var(--color-coral)' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Prints
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
