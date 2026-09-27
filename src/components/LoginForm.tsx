import React, { useState } from 'react';
import type { LoginResponse, FormState } from '../types';

interface LoginFormProps {
    onSwitchToSignup: () => void;
    onLoginSuccess: (user: any, token: string) => void;
    externalMessage?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onLoginSuccess, externalMessage }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [message, setMessage] = useState<string>('Sign in');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const result: LoginResponse = await response.json();
      
      if (response.ok && result.user && result.token) {
        setFormState('success');
        setMessage('Success');
        setTimeout(() => {
          setFormState('idle');
          setMessage('Sign in');
          onLoginSuccess(result.user!, result.token!);
        }, 1500);
      } else {
        setFormState('error');
        setMessage(`Error: ${result.error}`);
        setTimeout(() => {
            setFormState('idle');
            setMessage('Sign in');
        }, 3000);
      }
    } catch (err) {
      setFormState('error');
      setMessage('Connection Error');
      setTimeout(() => {
          setFormState('idle');
          setMessage('Sign in');
      }, 3000);
    }
  };

  return (
    <div className="view-section login-view active-view">
      <h1>Welcome back</h1>
      <p className="subtitle">Enter your credentials to access your account.</p>
      
      <form onSubmit={handleSubmit}>
        {externalMessage && (
            <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '13px', textAlign: 'center' }}>
                {externalMessage}
            </div>
        )}
        <div className="input-group">
          <label htmlFor="login-email">Email</label>
          <input type="email" id="login-email" required autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        
        <div className="input-group">
          <label htmlFor="login-password">Password</label>
          <input type="password" id="login-password" required autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <div className="form-actions">
          <label className="remember-me">
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          style={formState === 'error' ? {backgroundColor: '#ef4444'} : formState === 'success' ? {backgroundColor: '#10b981'} : {}}
        >
          {formState === 'loading' ? (
            <span className="loading-spinner" style={{display:'inline-block', width:'18px', height:'18px', border:'2px solid rgba(255,255,255,0.3)', borderRadius:'50%', borderTopColor:'#fff', animation:'spin 1s linear infinite'}}></span>
          ) : (
            <>
              <span>{message}</span>
              {formState === 'idle' && (
                <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              )}
            </>
          )}
        </button>
      </form>
      
      <p className="signup-prompt">Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>Sign up</a></p>
    </div>
  );
};
