
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="mb-6">
        <div className="bg-[#0A2647] text-white font-bold py-3 px-8 rounded">
          <div className="text-3xl">MEMS</div>
          <div className="text-xs">Monitoring & Evaluation Management System</div>
        </div>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 Monitoring & Evaluation Management System</p>
        <p className="mt-1">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Login;
