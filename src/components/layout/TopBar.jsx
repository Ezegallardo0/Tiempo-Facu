import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useAppData } from '../../context/AppDataContext';
import { BellIcon } from '../Icons';
import { MenuIcon, XIcon } from '../ui/Icons2';

const PAGE_TITLES = {
  home:         'Dashboard',
  materias:     'Mis Materias',
  tareas:       'Tareas',
  calendario:   'Calendario Académico',
  examenes:     'Exámenes',
  notas:        'Notas y Apuntes',
  estadisticas: 'Estadísticas',
  pomodoro:     'Temporizador Pomodoro',
  configuracion:'Configuración',
};

export default function TopBar({ currentView, onNavigate, onToggleSidebar }) {
  const { user } = useAuth();
  const { notifications, markAllRead, unreadCount } = useAppData();
  const [showNotifs, setShowNotifs] = useState(false);

  const recentNotifs = notifications.slice(0, 8);
  const title = PAGE_TITLES[currentView] || 'TiempoFacu';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <MenuIcon size={20} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <div className="topbar-notif-wrap">
          <button
            className="topbar-icon-btn"
            onClick={() => setShowNotifs(v => !v)}
            aria-label="Notificaciones"
          >
            <BellIcon size={20} />
            {unreadCount > 0 && <span className="topbar-notif-dot">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <span>Notificaciones</span>
                <button className="notif-mark-read" onClick={markAllRead}>Marcar todas leídas</button>
              </div>
              {recentNotifs.length === 0 ? (
                <p className="notif-empty">Sin notificaciones nuevas</p>
              ) : (
                recentNotifs.map(n => (
                  <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`}>
                    <span className="notif-msg">{n.message}</span>
                    <span className="notif-time">{n.createdAt?.split('T')[0]}</span>
                  </div>
                ))
              )}
              <button className="notif-close-btn" onClick={() => setShowNotifs(false)}>
                <XIcon size={14} /> Cerrar
              </button>
            </div>
          )}
        </div>

        {/* User avatar */}
        {user && (
          <button className="topbar-avatar-btn" onClick={() => onNavigate('configuracion')}>
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
              alt={user.name}
              className="topbar-avatar"
            />
          </button>
        )}
      </div>
    </header>
  );
}
