import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { user, signIn, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold mb-2">Hit-Fit</h1>
        <p className="text-gray-600 mb-6">Your Personal Health & Weight Tracker</p>
        <button
          onClick={signIn}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <LogIn className="mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
