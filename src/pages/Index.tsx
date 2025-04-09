
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const Index = () => {
  const { isAuthenticated } = useAppContext();
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
