import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import AuthLayout from '../components/auth/AuthLayout';

const Register = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = (userData) => {
    // User is already registered via the form, just navigate
    navigate('/dashboard');
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthLayout type="signup">
      <SignupForm
        onSignupSuccess={handleSignupSuccess}
        onNavigateToLogin={handleNavigateToLogin}
      />
    </AuthLayout>
  );
};

export default Register;
