import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-warm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl mb-6">📷</div>
        <h1
          className="text-4xl md:text-5xl font-bold text-brand-dark mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          404
        </h1>
        <h2 className="text-xl text-brand-dark mb-2">Page Not Found</h2>
        <p className="text-brand-secondary mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Link to="/">
            <Button className="rounded-full bg-brand-coral hover:bg-brand-coral/90 text-white">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
