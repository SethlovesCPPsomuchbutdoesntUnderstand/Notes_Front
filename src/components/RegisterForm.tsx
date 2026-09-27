import React, { useState } from 'react';
import type { SignupResponse, FormState } from '../types';

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [message, setMessage] = useState<string>('Create account');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const result: SignupResponse = await response.json();
      
      if (response.ok) {
        setFormState('success');
        setMessage('Success');
        setTimeout(() => {
          setFormState('idle');
          setMessage('Create account');
          setName('');
          setEmail('');
          setPassword('');
          onSwitchToLogin();
        }, 1500);
      } else {
        setFormState('error');
        setMessage(`Error: ${result.error}`);
        setTimeout(() => {
            setFormState('idle');
            setMessage('Create account');
        }, 3000);
      }
    } catch (err) {
      setFormState('error');
      setMessage('Connection Error');
      setTimeout(() => {
          setFormState('idle');
          setMessage('Create account');
      }, 3000);
    }
  };

  return (
    <div className="view-section signup-view">
      <h1>Create an account</h1>
      <p className="subtitle">Sign up to get started.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="signup-name">Full Name</label>
          <input type="text" id="signup-name" required autoComplete="off" value={name} onChange={e => setName(e.target.value)} />
        </div>
        
        <div className="input-group">
          <label htmlFor="signup-email">Email</label>
          <input type="email" id="signup-email" required autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        
        <div className="input-group">
          <label htmlFor="signup-password">Password</label>
          <input type="password" id="signup-password" required autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} />
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
      
      <p className="signup-prompt">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Sign in</a></p>
    </div>
  );
};
