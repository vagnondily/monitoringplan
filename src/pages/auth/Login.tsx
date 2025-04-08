
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="mb-8">
        <img 
          src="https://cdn.lovable.dev/mems-logo.png" 
          alt="MEMS Logo" 
          className="h-16 w-auto"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIGZpbGw9IiMwQTI2NDciLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1FTVM8L3RleHQ+PC9zdmc+';
            e.currentTarget.style.height = '40px';
          }}
        />
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
