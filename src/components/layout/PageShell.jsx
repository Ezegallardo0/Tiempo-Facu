import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function PageShell({ currentView, onNavigate, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
      />
      <div className="app-main">
        <TopBar
          currentView={currentView}
          onNavigate={onNavigate}
          onToggleSidebar={() => setCollapsed(v => !v)}
        />
        <main key={currentView} className="app-content page-transition">
          {children}
        </main>
      </div>
    </div>
  );
}
