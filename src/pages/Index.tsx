
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const Index = () => {
  const { isAuthenticated } = useAppContext();
  
  // If authenticated, redirect to dashboard
  // If not authenticated, redirect to login
  return isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

export default Index;
