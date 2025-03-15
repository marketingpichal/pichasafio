import { useContext } from 'react';
import { AuthContext } from '@/context/AuthProvider';
import PublicMessage from '../PublicMessage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <PublicMessage />;
  }

  return <>{children}</>;
}