import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import { AppDataProvider } from './context/AppDataContext';
import { ToastProvider } from './components/ui/Toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicLandingPage from './pages/PublicLandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import PageShell from './components/layout/PageShell';
import DashboardPage from './pages/DashboardPage';
import MateriasPage from './pages/MateriasPage';
import TareasPage from './pages/TareasPage';
import CalendarioPage from './pages/CalendarioPage';
import ExamenesPage from './pages/ExamenesPage';
import NotasPage from './pages/NotasPage';
import EstadisticasPage from './pages/EstadisticasPage';
import PomodoroPage from './pages/PomodoroPage';
import ConfiguracionPage from './pages/ConfiguracionPage';

import './App.css';

const HASH_MAP = {
  '#login': 'login', '#registro': 'register', '#register': 'register',
  '#dashboard': 'home', '#panel': 'home', '#app': 'home',
  '#materias': 'materias', '#tareas': 'tareas',
  '#calendario': 'calendario', '#calendar': 'calendario',
  '#examenes': 'examenes', '#notas': 'notas',
  '#estadisticas': 'estadisticas', '#pomodoro': 'pomodoro',
  '#configuracion': 'configuracion', '#settings': 'configuracion',
};

const VIEW_HASH = {
  login: '#login', register: '#registro',
  home: '#dashboard', materias: '#materias', tareas: '#tareas',
  calendario: '#calendario', examenes: '#examenes', notas: '#notas',
  estadisticas: '#estadisticas', pomodoro: '#pomodoro', configuracion: '#configuracion',
};

const APP_VIEWS = ['home', 'materias', 'tareas', 'calendario', 'examenes', 'notas', 'estadisticas', 'pomodoro', 'configuracion'];

function getInitialView() {
  const hash = window.location.hash.toLowerCase();
  return HASH_MAP[hash] || 'landing';
}

function MainApp() {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState(getInitialView);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      setCurrentView(HASH_MAP[hash] || 'landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view) => {
    setCurrentView(view);
    if (VIEW_HASH[view]) {
      window.location.hash = VIEW_HASH[view];
    } else {
      window.location.hash = '#';
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-redirect logged-in users from landing to dashboard
  useEffect(() => {
    if (isAuthenticated && user && currentView === 'landing') {
      navigate('home');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, currentView]);

  // --- Auth pages (no layout) ---
  if (currentView === 'login') return <LoginPage onNavigate={navigate} />;
  if (currentView === 'register') return <RegisterPage onNavigate={navigate} />;

  // --- Authenticated app (with Sidebar) ---
  if (isAuthenticated && user && APP_VIEWS.includes(currentView)) {
    return (
      <AppDataProvider>
        <PageShell currentView={currentView} onNavigate={navigate}>
          {currentView === 'home'          && <DashboardPage onNavigate={navigate} />}
          {currentView === 'materias'      && <MateriasPage />}
          {currentView === 'tareas'        && <TareasPage />}
          {currentView === 'calendario'    && <CalendarioPage />}
          {currentView === 'examenes'      && <ExamenesPage />}
          {currentView === 'notas'         && <NotasPage />}
          {currentView === 'estadisticas'  && <EstadisticasPage />}
          {currentView === 'pomodoro'      && <PomodoroPage />}
          {currentView === 'configuracion' && <ConfiguracionPage onNavigate={navigate} />}
        </PageShell>
      </AppDataProvider>
    );
  }

  // --- Public (landing) ---
  return (
    <div className="tiempofacu-root">
      <Navbar onNavigate={navigate} />
      <PublicLandingPage
        onOpenAuth={(mode) => navigate(mode === 'login' ? 'login' : 'register')}
        onNavigate={navigate}
      />
      <Footer onOpenAuth={(mode) => navigate(mode === 'login' ? 'login' : 'register')} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
