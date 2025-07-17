import React, { useState, useEffect } from 'react';
import ModernSidebar from './ModernSidebar';
import Header from '../Header';

export default function AppLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      <ModernSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="p-4">
          <div className="container-fluid">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}