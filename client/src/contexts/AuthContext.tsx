import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      // First, sign up the user with auto-confirmation enabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Set up redirects and metadata
          emailRedirectTo: window.location.origin,
          data: { email }
        }
      });
      
      if (error) return { error };
      
      // For Supabase, signUp may return a user even if confirmation is required
      // Auto-sign in only if they were actually confirmed
      if (data?.user && !data.user.identities?.[0]?.identity_data?.email_confirmed_at) {
        // Try to auto sign-in if signup was successful
        const signInResult = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        // If there's a sign-in error, just log it, don't block signup success
        if (signInResult.error) {
          console.warn("Auto-login after signup failed:", signInResult.error.message);
        }
      }
      
      return { error: null };
    } catch (err) {
      console.error("Signup error:", err);
      return { error: err instanceof Error ? err : new Error("Unknown signup error") };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 