import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import AuthLayout from '../components/auth/AuthLayout';
import { useEffect, useState } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user1');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }
  }, [navigate]);

  const handleLoginSuccess = (userData) => {
    // User data is already stored in localStorage by LoginForm
    // Just navigate to dashboard
    navigate('/dashboard');
  };

  const handleNavigateToSignup = () => {
    navigate('/register');
  };

  return (
    <AuthLayout type="login">
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignup={handleNavigateToSignup}
      />
    </AuthLayout>
  );
};

export default Login;
