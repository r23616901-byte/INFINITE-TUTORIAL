import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export const RootLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '2rem 1rem' }}>
        <Outlet />
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '1.25rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)',
        backgroundColor: '#ffffff'
      }}>
        © {new Date().getFullYear()} Infinite Tutorial. All rights reserved.
      </footer>
    </div>
  );
};
