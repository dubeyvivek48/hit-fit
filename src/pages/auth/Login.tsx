import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Chrome as Google } from "lucide-react";

const Login = () => {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Health Tracker
        </h1>
        <p className="text-gray-600 mb-6">
          Track your health and weight goals with ease.
        </p>
        <button
          onClick={login}
          className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Google className="h-5 w-5 mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
