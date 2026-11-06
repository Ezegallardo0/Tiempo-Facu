import { useState } from 'react';
import { GraduationCapIcon } from './Icons';

export default function Navbar({ onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="brand-icon-wrapper">
            <GraduationCapIcon size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Tiempo<span className="brand-accent">Facu</span></span>
            <span className="brand-tag">TU ORGANIZADOR DE FACULTAD</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button onClick={() => scrollToSection('preview')} className="nav-item-btn">
            Horario & Widgets
          </button>
          <button onClick={() => scrollToSection('calculadora')} className="nav-item-btn">
            Calculadora de Notas
            <span className="badge-pastel-pill">Fórmula</span>
          </button>
          <button onClick={() => scrollToSection('tareas')} className="nav-item-btn">
            Tareas & TPs
          </button>
          <button onClick={() => scrollToSection('caracteristicas')} className="nav-item-btn">
            ¿Por qué usarlo?
          </button>
          <button onClick={() => scrollToSection('precios')} className="nav-item-btn">
            Planes
          </button>
          <button onClick={() => scrollToSection('faq')} className="nav-item-btn">
            Preguntas
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button onClick={() => onOpenAuth('login')} className="btn-secondary-nav">
            Iniciar Sesión
          </button>
          <button onClick={() => onOpenAuth('register')} className="btn-primary-nav">
            <span>Crear Cuenta Gratis</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open-1' : ''}`}></span>
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open-2' : ''}`}></span>
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open-3' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <button onClick={() => scrollToSection('preview')} className="mobile-nav-item">
            📅 Horario & Widgets
          </button>
          <button onClick={() => scrollToSection('calculadora')} className="mobile-nav-item highlight">
            🧮 Calculadora de Notas & Promoción
          </button>
          <button onClick={() => scrollToSection('tareas')} className="mobile-nav-item">
            📝 Tareas y Entregas de TPs
          </button>
          <button onClick={() => scrollToSection('caracteristicas')} className="mobile-nav-item">
            ✨ Funcionalidades
          </button>
          <button onClick={() => scrollToSection('precios')} className="mobile-nav-item">
            🏷️ Planes
          </button>
          <button onClick={() => scrollToSection('faq')} className="mobile-nav-item">
            ❓ Preguntas Frecuentes
          </button>
          <div className="mobile-drawer-footer">
            <button onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }} className="btn-secondary-full">
              Iniciar Sesión
            </button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }} className="btn-primary-full">
              Crear Cuenta Gratis
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
