import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import StudentHomeOrganizer from './components/StudentHomeOrganizer';
import Footer from './components/Footer';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedDashboard from './pages/ProtectedDashboard';
import './App.css';

function MainApp() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#login') return 'login';
    if (hash === '#registro' || hash === '#register') return 'register';
    if (hash === '#dashboard' || hash === '#panel' || hash === '#app') return 'dashboard';
    if (hash === '#calendario' || hash === '#calendar') return 'calendar';
    if (hash === '#configuracion' || hash === '#settings') return 'settings';
    return 'landing';
  });

  // Sync with browser hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') setCurrentView('login');
      else if (hash === '#registro' || hash === '#register') setCurrentView('register');
      else if (hash === '#dashboard' || hash === '#panel' || hash === '#app') setCurrentView('dashboard');
      else if (hash === '#calendario' || hash === '#calendar') setCurrentView('calendar');
      else if (hash === '#configuracion' || hash === '#settings') setCurrentView('settings');
      else setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view) => {
    setCurrentView(view);
    if (view === 'login') window.location.hash = '#login';
    else if (view === 'register') window.location.hash = '#registro';
    else if (view === 'dashboard') window.location.hash = '#dashboard';
    else if (view === 'calendar') window.location.hash = '#calendario';
    else if (view === 'settings') window.location.hash = '#configuracion';
    else {
      window.location.hash = '#';
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. LOGIN PAGE VIEW
  if (currentView === 'login') {
    return <LoginPage onNavigate={navigate} />;
  }

  // 2. REGISTER PAGE VIEW
  if (currentView === 'register') {
    return <RegisterPage onNavigate={navigate} />;
  }

  // 3. PROTECTED CONTENT (DASHBOARD, CALENDAR, OR SETTINGS)
  if (currentView === 'dashboard' || currentView === 'settings' || currentView === 'calendar') {
    return (
      <ProtectedDashboard
        onNavigate={navigate}
        initialTab={
          currentView === 'settings'
            ? 'configuracion'
            : currentView === 'calendar'
            ? 'calendario'
            : 'horario'
        }
      />
    );
  }

  // 4. MAIN STUDENT ORGANIZER HOME VIEW (NO LANDING PAGE MARKETING FLUFF!)
  return (
    <div className="tiempofacu-root">
      <Navbar onNavigate={navigate} />

      <main className="main-content-flow">
        <StudentHomeOrganizer
          onNavigate={navigate}
          onOpenAuth={(mode) => navigate(mode === 'login' ? 'login' : 'register')}
        />
      </main>

      <Footer onOpenAuth={(mode) => navigate(mode === 'login' ? 'login' : 'register')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
