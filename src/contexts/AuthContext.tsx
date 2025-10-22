import { createContext, useContext, useEffect, useState } from 'react';
import { me, logout } from '../lib/auth-simple';
import type { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const currentUser = me();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signOut = () => {
    logout();
    setUser(null);
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <AuthContext.Provider value={{ user: null, loading: true, signOut }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);