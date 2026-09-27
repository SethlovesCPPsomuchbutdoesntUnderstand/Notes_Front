import React, { useState } from 'react';
import type { User, FormState } from '../types';

interface SettingsProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [formState, setFormState] = useState<FormState>('idle');
  const [message, setMessage] = useState('Save Changes');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            name, 
            email, 
            ...(newPassword ? { currentPassword, newPassword } : {})
        })
      });
      
      if (response.status === 401) {
          window.dispatchEvent(new Event('session-expired'));
          return;
      }
      
      const result = await response.json();
      
      if (response.ok) {
        setFormState('success');
        setMessage('Settings updated!');
        setTimeout(() => {
          setFormState('idle');
          setMessage('Save Changes');
          setCurrentPassword('');
          setNewPassword('');
          onUpdate(result.user);
        }, 1500);
      } else {
        setFormState('error');
        setMessage(`Error: ${result.error}`);
        setTimeout(() => {
            setFormState('idle');
            setMessage('Save Changes');
        }, 3000);
      }
    } catch (err) {
      setFormState('error');
      setMessage('Connection Error');
      setTimeout(() => {
          setFormState('idle');
          setMessage('Save Changes');
      }, 3000);
    }
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 600 }}>Profile Information</h3>
        
        <div className="input-group">
          <label htmlFor="settings-name">Full Name</label>
          <input type="text" id="settings-name" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        
        <div className="input-group">
          <label htmlFor="settings-email">Email Address</label>
          <input type="email" id="settings-email" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        
        <hr style={{ border: 0, borderTop: '1px solid var(--input-border)', margin: '32px 0' }} />
        
        <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 600 }}>Change Password</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Leave blank if you don't want to change your password.</p>

        <div className="input-group">
          <label htmlFor="current-password">Current Password</label>
          <input type="password" id="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
        </div>
        
        <div className="input-group">
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          style={{ marginTop: '32px', ...(formState === 'error' ? {backgroundColor: '#ef4444'} : formState === 'success' ? {backgroundColor: '#10b981'} : {}) }}
        >
          {formState === 'loading' ? (
            <span className="loading-spinner" style={{display:'inline-block', width:'18px', height:'18px', border:'2px solid rgba(255,255,255,0.3)', borderRadius:'50%', borderTopColor:'#fff', animation:'spin 1s linear infinite'}}></span>
          ) : (
             <span>{message}</span>
          )}
        </button>
      </form>
    </div>
  );
};
