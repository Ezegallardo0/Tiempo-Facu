export default function EmptyState({ emoji = '📭', title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-emoji">{emoji}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
