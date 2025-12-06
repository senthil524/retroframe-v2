import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/seo/SEO';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, signOut, isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin()) {
      navigate('/Admin');
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        toast.error('Login failed: ' + signInError.message);
        setLoading(false);
        return;
      }

      // Check if user is admin after successful login
      if (data?.user) {
        // Check admin status - we need to check the user object directly
        // since the context might not have updated yet
        const adminEmails = [
          'senthil524@gmail.com',
          'admin@retroframe.co',
          'senthil@retroframe.co',
        ];

        const userIsAdmin =
          data.user.app_metadata?.role === 'admin' ||
          data.user.user_metadata?.role === 'admin' ||
          adminEmails.includes(data.user.email?.toLowerCase());

        if (!userIsAdmin) {
          setError('You do not have admin access');
          toast.error('Access denied: You do not have admin privileges');
          // Sign out if not admin
          await signOut();
          setLoading(false);
          return;
        }

        toast.success('Welcome back, Admin!');
        navigate('/Admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
      toast.error('Login failed');
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <Loader2 className="w-8 h-8 animate-spin text-brand-coral" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm flex items-center justify-center p-4">
      <SEO
        title="Admin Login"
        description="RetroFrame admin login page"
        url="/AdminLogin"
        noindex={true}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-brand-coral" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-normal text-brand-dark mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Admin Login
            </h1>
            <p className="text-brand-secondary">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-dark">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@retroframe.co"
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-brand-coral focus:ring-brand-coral"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand-dark">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-brand-coral focus:ring-brand-coral"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-brand-coral hover:bg-brand-coral-dark text-white font-medium text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-brand-secondary hover:text-brand-coral transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-brand-secondary mt-4">
          This area is restricted to authorized administrators only.
        </p>
      </motion.div>
    </div>
  );
}
