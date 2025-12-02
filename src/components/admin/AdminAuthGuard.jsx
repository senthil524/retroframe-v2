import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AdminAuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      
      if (!isAuthenticated) {
        // Redirect to login
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      const user = await base44.auth.me();
      
      if (user.role === 'admin') {
        setIsAdmin(true);
      } else {
        setError('You do not have admin access');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <Loader2 className="w-8 h-8 animate-spin text-brand-coral" />
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen bg-brand-warm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {error || 'You need admin privileges to access this page.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="rounded-full"
            >
              Go Home
            </Button>
            <Button
              onClick={handleLogout}
              className="rounded-full bg-brand-coral hover:bg-brand-coral-dark text-white"
            >
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
}