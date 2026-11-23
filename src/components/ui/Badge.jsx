const PRIORITY_CONFIG = {
  urgente: { label: '🔴 Urgente', cls: 'badge-urgente' },
  alta:    { label: '🟠 Alta',    cls: 'badge-alta' },
  media:   { label: '🟡 Media',   cls: 'badge-media' },
  baja:    { label: '🟢 Baja',    cls: 'badge-baja' },
};

const STATUS_CONFIG = {
  pendiente:   { label: 'Pendiente',   cls: 'badge-pendiente' },
  en_progreso: { label: 'En progreso', cls: 'badge-en-progreso' },
  completada:  { label: 'Completada',  cls: 'badge-completada' },
};

const TYPE_CONFIG = {
  parcial:      { label: 'Parcial',      cls: 'badge-parcial' },
  recuperatorio:{ label: 'Recuperatorio',cls: 'badge-recup' },
  final:        { label: 'Final',        cls: 'badge-final' },
  entrega:      { label: 'Entrega TP',   cls: 'badge-entrega' },
  clase:        { label: 'Clase',        cls: 'badge-clase' },
  evento:       { label: 'Evento',       cls: 'badge-evento' },
  recup:        { label: 'Recuperatorio',cls: 'badge-recup' },
};

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || { label: priority, cls: '' };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: '' };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

export function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || { label: type, cls: 'badge-evento' };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}
