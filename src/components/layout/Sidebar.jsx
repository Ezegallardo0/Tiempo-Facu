import { useAuth } from '../../context/useAuth';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  CalendarIcon, SettingsIcon, LogOutIcon,
} from '../Icons';
import {
  LayoutDashboardIcon, ListChecksIcon, GraduationCapIcon,
  BarChartIcon, TimerIcon, FileTextIcon, TrophyIcon, SunIcon, MoonIcon
} from '../ui/Icons2';

const NAV_ITEMS = [
  { id: 'home',          label: 'Dashboard',     Icon: LayoutDashboardIcon },
  { id: 'materias',      label: 'Materias',       Icon: GraduationCapIcon },
  { id: 'tareas',        label: 'Tareas',         Icon: ListChecksIcon },
  { id: 'calendario',    label: 'Calendario',     Icon: CalendarIcon },
  { id: 'examenes',      label: 'Exámenes',       Icon: TrophyIcon },
  { id: 'notas',         label: 'Mis Notas',      Icon: FileTextIcon },
  { id: 'estadisticas',  label: 'Estadísticas',   Icon: BarChartIcon },
  { id: 'pomodoro',      label: 'Pomodoro',       Icon: TimerIcon },
];

export default function Sidebar({ currentView, onNavigate, collapsed, onToggle: _onToggle }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useAppData();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => { logout(); onNavigate('landing'); };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-logo">🎒</span>
        {!collapsed && <span className="sidebar-brand-name">TiempoFacu</span>}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`sidebar-nav-item ${currentView === id ? 'active' : ''}`}
            title={label}
            aria-label={label}
          >
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
            {id === 'tareas' && !collapsed && unreadCount > 0 && (
              <span className="sidebar-badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <button
          onClick={() => onNavigate('configuracion')}
          className={`sidebar-nav-item ${currentView === 'configuracion' ? 'active' : ''}`}
          title="Configuración"
          aria-label="Configuración"
        >
          <SettingsIcon size={18} />
          {!collapsed && <span>Configuración</span>}
        </button>

        <button
          onClick={toggleTheme}
          className="sidebar-nav-item sidebar-theme-btn"
          title="Cambiar tema"
          aria-label="Cambiar tema"
          aria-pressed={theme === 'dark'}
        >
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          {!collapsed && <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>}
        </button>

        {user && (
          <div className="sidebar-user">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
              alt={user.name}
              className="sidebar-avatar"
            />
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name.split(' ')[0]}</span>
                <span className="sidebar-user-career">{user.career || 'Estudiante'}</span>
              </div>
            )}
            <button onClick={handleLogout} className="sidebar-logout-btn" title="Cerrar sesión" aria-label="Cerrar sesión">
              <LogOutIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
