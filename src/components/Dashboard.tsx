import React, { useState } from 'react';
import type { User } from '../types';
import { Settings } from './Settings';
import { NotesWidget } from './NotesWidget';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'middle'}}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
          MyApp
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'overview' ? 600 : 400, color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-muted)' }}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'settings' ? 600 : 400, color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)' }}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button className="logout-btn" onClick={onLogout} style={{ marginLeft: '16px' }}>Sign out</button>
        </div>
      </nav>
      <main className="dashboard-main">
        {activeTab === 'overview' ? (
            <>
                <h1>Welcome, {user.name}!</h1>
                <p className="subtitle">Here is your minimal dashboard overview.</p>
                
                <div className="stats-grid">
                  <div className="stat-card">
                      <h3>Account Status</h3>
                      <p style={{color: '#10b981'}}>Active</p>
                  </div>
                  <div className="stat-card">
                      <h3>Email Address</h3>
                      <p>{user.email}</p>
                  </div>
                </div>
                <NotesWidget />
            </>
        ) : (
            <>
                <h1>Account Settings</h1>
                <p className="subtitle">Update your profile information and password.</p>
                <Settings user={user} onUpdate={onUserUpdate} />
            </>
        )}
      </main>
    </div>
  );
};
