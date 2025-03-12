import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}