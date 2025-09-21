
"use client";
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | null = useMemo(() => {
    if (!session?.user) return null;
    
    return {
      id: session.user.id || '',
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      provider: session.user.provider
    };
  }, [session]);

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated'
  };
}
