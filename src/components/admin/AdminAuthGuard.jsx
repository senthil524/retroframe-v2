import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldX, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AdminAuthGuard({ children }) {
  let authData;
  let authError = null;

  try {
    authData = useAuth();
  } catch (error) {
    console.error('AdminAuthGuard: useAuth error:', error);
    authError = error;
  }

  // If there's an auth error, show error state
  if (authError) {
    return (
      <div className="min-h-screen bg-brand-warm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-brand-dark mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4 text-sm">{authError.message}</p>
          <Button onClick={() => window.location.href = '/'} className="rounded-full">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const { user, loading, isAuthenticated, isAdmin, signOut } = authData;

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <Loader2 className="w-8 h-8 animate-spin text-brand-coral" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  // Show access denied if not admin
  if (!isAdmin()) {
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
          <p className="text-gray-600 mb-2">
            You don't have admin privileges to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Logged in as: {user?.email}
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
              onClick={async () => {
                await signOut();
                window.location.href = '/admin-login';
              }}
              className="rounded-full bg-brand-coral hover:bg-brand-coral-dark text-white"
            >
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // User is authenticated and is admin - render children
  return children;
}
