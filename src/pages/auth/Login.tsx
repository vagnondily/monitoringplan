
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="mb-6">
        <div className="bg-[#0A2647] text-white font-bold py-2 px-8 rounded text-xl">
          MEMS
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
