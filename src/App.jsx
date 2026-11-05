import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const MODULES = [
  {
    id: 1,
    title: 'Módulo 1: Fundamentos de React & Ecosistema Moderno',
    icon: '⚡',
    duration: 'Semana 1',
    description: 'Componentes declarativos, JSX, props, estructura con Vite y buenas prácticas de desarrollo ágil.',
    topics: ['JSX Moderno', 'Props & Composición', 'Vite Fast HMR', 'Clean Architecture']
  },
  {
    id: 2,
    title: 'Módulo 2: Estado, Efectos y Hooks Esenciales',
    icon: '🧠',
    duration: 'Semana 2',
    description: 'Domina useState, useEffect y custom hooks para construir interfaces fluidas y reactivas.',
    topics: ['useState & useReducer', 'useEffect Lifecycle', 'Custom Hooks', 'Gestión de Formularios']
  },
  {
    id: 3,
    title: 'Módulo 3: La Filosofía VibeCoding con IA',
    icon: '🤖',
    duration: 'Semana 3',
    description: 'Aprende a pair-programmar con asistentes de IA: prompting efectivo, refactorización y debugging asistido.',
    topics: ['AI Pair Programming', 'Prompting para UI/UX', 'Iteración Veloz', 'Auditoría de Código']
  },
  {
    id: 4,
    title: 'Módulo 4: Proyecto Final & Despliegue en Producción',
    icon: '🚀',
    duration: 'Semana 4',
    description: 'Construcción integral de una Single Page Application (SPA) lista para tu portafolio y desplegada en la nube.',
    topics: ['Consumo de APIs', 'Tailwind / Modern CSS', 'Deploy en Vercel/Netlify', 'Portfolio Ready']
  }
]

const VIBE_PROMPTS = [
  'Crea una tarjeta de perfil de desarrollador interactiva con efecto 3D tilt y badges de tecnologías.',
  'Construye un reproductor de música minimalista con barra de progreso interactiva y temas retro.',
  'Desarrolla un tablero Kanban con drag and drop y almacenamiento automático en localStorage.',
  'Diseña un generador de gradientes CSS con botón para copiar código y preview en tiempo real.',
  'Crea un dashboard financiero con gráficos animados y switch para modo oscuro/claro.'
]

export default function App() {
  const [activeTab, setActiveTab] = useState(1)
  const [vibeCount, setVibeCount] = useState(100)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Instalar Node.js y levantar el entorno con Vite', done: true },
    { id: 2, text: 'Explorar la estructura del proyecto en React', done: true },
    { id: 3, text: 'Probar el primer prompt en el generador de VibeCoding', done: false },
    { id: 4, text: 'Comprender el ciclo de renderizado de componentes', done: false },
    { id: 5, text: 'Unirse al canal comunitario y compartir tu proyecto', done: false }
  ])

  const toggleChecklist = (id) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  const completedCount = checklist.filter(item => item.done).length
  const progressPercent = Math.round((completedCount / checklist.length) * 100)

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % VIBE_PROMPTS.length)
    setCopied(false)
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(VIBE_PROMPTS[currentPromptIndex])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="logo-badge">
            <img src={reactLogo} className="nav-logo spin-slow" alt="React" />
            <span className="logo-spark">⚡</span>
          </div>
          <div>
            <h1 className="nav-title">VibeCoding</h1>
            <span className="nav-subtitle">con React</span>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#modulos" className="nav-link">Plan de Estudio</a>
          <a href="#prompt-lab" className="nav-link">Prompt Lab</a>
          <a href="#checklist" className="nav-link">Checklist</a>
        </nav>

        <div className="nav-actions">
          <span className="badge-live">
            <span className="pulse-dot"></span>
            Curso Intensivo 2026
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>✨ ¡Bienvenido a bordo!</span>
        </div>

        <h2 className="hero-heading">
          Aprende a programar al <br />
          <span className="gradient-text">ritmo de tu pensamiento</span>
        </h2>

        <p className="hero-description">
          Bienvenido al <strong>Curso Intensivo de VibeCoding con React</strong>. Descubre cómo combinar
          el poder del ecosistema moderno de React con herramientas de IA para construir aplicaciones
          web sorprendentes en tiempo récord, con fluidez, estilo y código de alta calidad.
        </p>

        {/* Hero Interactive Pill / Controls */}
        <div className="hero-controls">
          <button
            className="btn btn-primary"
            onClick={() => {
              setVibeCount(v => v + 10)
              const el = document.getElementById('modulos')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Explorar Módulos 🚀
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setVibeCount(v => v + 25)}
          >
            ⚡ Aumentar Vibe: {vibeCount}%
          </button>
        </div>

        {/* Floating tech stack pills */}
        <div className="tech-stack">
          <div className="tech-pill">
            <img src={reactLogo} alt="React" width="20" height="20" />
            <span>React 19</span>
          </div>
          <div className="tech-pill">
            <img src={viteLogo} alt="Vite" width="20" height="20" />
            <span>Vite</span>
          </div>
          <div className="tech-pill">
            <span>🤖 AI-Assisted Dev</span>
          </div>
          <div className="tech-pill">
            <span>🎨 UI & UX Fluida</span>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="pillars-section">
        <div className="pillar-card">
          <div className="pillar-icon">⚡</div>
          <h3>Velocidad & Fluidez</h3>
          <p>
            Di adiós a los bloqueos creativos. Convierte ideas en interfaces interactivas en minutos usando flujo guiado por IA.
          </p>
        </div>
        <div className="pillar-card">
          <div className="pillar-icon">⚛️</div>
          <h3>Bases Sólidas de React</h3>
          <p>
            No solo prompts: comprende a fondo el estado, los componentes modulares y el ciclo de vida de React.
          </p>
        </div>
        <div className="pillar-card">
          <div className="pillar-icon">🎯</div>
          <h3>Enfoque en Proyectos</h3>
          <p>
            Aprende construyendo aplicaciones reales y completas que podrás lucir en tu portafolio profesional.
          </p>
        </div>
      </section>

      {/* Modules Roadmap */}
      <section id="modulos" className="modules-section">
        <div className="section-header">
          <span className="section-tag">Ruta de Aprendizaje</span>
          <h2 className="section-title">Contenido del Curso</h2>
          <p className="section-subtitle">
            Un itinerario intensivo diseñado para llevarte de cero a dominar el desarrollo ágil con React.
          </p>
        </div>

        <div className="module-tabs">
          {MODULES.map(m => (
            <button
              key={m.id}
              className={`module-tab-btn ${activeTab === m.id ? 'active' : ''}`}
              onClick={() => setActiveTab(m.id)}
            >
              <span className="tab-icon">{m.icon}</span>
              <span className="tab-title">Módulo {m.id}</span>
            </button>
          ))}
        </div>

        {/* Active Module Card */}
        {(() => {
          const current = MODULES.find(m => m.id === activeTab) || MODULES[0]
          return (
            <div className="active-module-card">
              <div className="module-header">
                <div className="module-title-wrap">
                  <span className="module-badge">{current.duration}</span>
                  <h3>{current.title}</h3>
                </div>
                <span className="module-icon-large">{current.icon}</span>
              </div>
              <p className="module-desc">{current.description}</p>

              <div className="topics-grid">
                {current.topics.map((topic, i) => (
                  <div key={i} className="topic-item">
                    <span className="topic-dot">✔</span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </section>

      {/* Interactive Prompt Lab */}
      <section id="prompt-lab" className="prompt-lab-section">
        <div className="section-header">
          <span className="section-tag">Laboratorio Interactivo</span>
          <h2 className="section-title">Generador de Retos VibeCoding</h2>
          <p className="section-subtitle">
            Pon a prueba tu flujo de trabajo. Copia este prompt y utilízalo con tu asistente de IA para crear tu próximo componente.
          </p>
        </div>

        <div className="prompt-card">
          <div className="prompt-card-header">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="prompt-card-title">Prompt de Práctica #{currentPromptIndex + 1}</span>
          </div>
          <div className="prompt-card-body">
            <p className="prompt-text">"{VIBE_PROMPTS[currentPromptIndex]}"</p>
          </div>
          <div className="prompt-card-footer">
            <button className="btn btn-secondary" onClick={nextPrompt}>
              🔄 Siguiente Reto
            </button>
            <button className="btn btn-primary" onClick={copyPrompt}>
              {copied ? '✅ ¡Copiado!' : '📋 Copiar Prompt'}
            </button>
          </div>
        </div>
      </section>

      {/* Student Welcome Checklist */}
      <section id="checklist" className="checklist-section">
        <div className="section-header">
          <span className="section-tag">Paso a Paso</span>
          <h2 className="section-title">Checklist del Estudiante</h2>
          <p className="section-subtitle">
            Completa estos pasos iniciales para prepararte para el inicio de las sesiones.
          </p>
        </div>

        <div className="checklist-card">
          <div className="progress-header">
            <span>Progreso de preparación</span>
            <span className="progress-value">{progressPercent}%</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="checklist-items">
            {checklist.map(item => (
              <label
                key={item.id}
                className={`checklist-item ${item.done ? 'item-done' : ''}`}
                onClick={() => toggleChecklist(item.id)}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => { }} // handled by parent onClick
                />
                <span className="checkbox-custom">
                  {item.done ? '✓' : ''}
                </span>
                <span className="item-text">{item.text}</span>
              </label>
            ))}
          </div>

          {progressPercent === 100 && (
            <div className="congrats-banner">
              🎉 ¡Excelente! Tienes todo preparado para vivir la experiencia completa de VibeCoding.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-badge mini">
              <img src={reactLogo} className="nav-logo" alt="React" />
              <span>⚡</span>
            </div>
            <span>Curso Intensivo de VibeCoding con React &copy; {new Date().getFullYear()}</span>
          </div>

          <div className="footer-links">
            <a href="https://react.dev/" target="_blank" rel="noreferrer" className="footer-link">
              Documentación React
            </a>
            <a href="https://vite.dev/" target="_blank" rel="noreferrer" className="footer-link">
              Guía de Vite
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
