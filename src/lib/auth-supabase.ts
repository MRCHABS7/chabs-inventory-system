import { supabase } from './supabase';
import type { User } from './types';

export const auth = {
  // Sign up new user
  async signUp(email: string, password: string, userData: { name: string; role: User['role'] }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email!,
      role: user.user_metadata?.role || 'user'
    } as User;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!,
          role: session.user.user_metadata?.role || 'user'
        } as User;
        callback(user);
      } else {
        callback(null);
      }
    });
  }
};