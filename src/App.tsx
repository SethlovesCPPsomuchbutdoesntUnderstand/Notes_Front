import { useState, useEffect } from 'react';
import './index.css';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import type { User } from './types';

function App() {
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleSessionExpired = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsVerifying(false);
      setSessionMessage('Your session has expired. Please sign in again.');
    };
    
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsVerifying(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/verify', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else if (response.status === 401) {
          window.dispatchEvent(new Event('session-expired'));
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, []);

  const handleLoginSuccess = (userData: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (isVerifying) {
    return (
      <div className="auth-wrapper">
         <span className="loading-spinner" style={{display:'inline-block', width:'32px', height:'32px', border:'3px solid rgba(0,0,0,0.1)', borderRadius:'50%', borderTopColor:'#000', animation:'spin 1s linear infinite'}}></span>
      </div>
    );
  }

  if (user) {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout} 
        onUserUpdate={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }} 
      />
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="login-container">
        <div className="glass-panel">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
            </svg>
          </div>
          
          <div className={`form-slider ${isSignup ? 'show-signup' : ''}`}>
            <LoginForm 
              onSwitchToSignup={() => { setIsSignup(true); setSessionMessage(null); }} 
              onLoginSuccess={handleLoginSuccess} 
              externalMessage={sessionMessage} 
            />
            <RegisterForm onSwitchToLogin={() => setIsSignup(false)} />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
