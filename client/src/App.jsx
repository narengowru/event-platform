import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/common/NavBar';
import Footer from './components/common/Footer';
import SignUpForm from './components/auth/SignUpForm';
import LoginForm from './components/auth/LoginForm';

function App() {
  const user = null;

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 w-full">
        <Navbar user={user} onLogout={handleLogout} />

        {/* Page content wrapper */}
        <div className="w-full">
          <main className="max-w-7xl mx-auto px-6 py-6">
            {/* Your page content */}
          </main>
        </div>


        
        <LoginForm />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
