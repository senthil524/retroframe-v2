import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  // Check if user is admin (based on email or app_metadata)
  const isAdmin = () => {
    if (!user) return false;

    // Check app_metadata for admin role
    if (user.app_metadata?.role === 'admin') return true;

    // Check user_metadata for admin role
    if (user.user_metadata?.role === 'admin') return true;

    // Fallback: check if email matches admin email(s)
    const adminEmails = [
      'senthil524@gmail.com',
      'admin@retroframe.co',
      'senthil@retroframe.co',
      // Add more admin emails here
    ];

    return adminEmails.includes(user.email?.toLowerCase());
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
    isAuthenticated: !!session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
