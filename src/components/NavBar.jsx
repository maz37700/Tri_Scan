import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Accueil' },
  { path: '/history', icon: '📋', label: 'Historique' },
  { path: '/profile', icon: '🏆', label: 'Profil' },
];

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on result page
  if (location.pathname === '/result') return null;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: 'rgba(2, 44, 34, 0.95)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(52, 211, 153, 0.12)',
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0',
      paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '6px 16px',
              opacity: active ? 1 : 0.5,
              transition: 'opacity 0.15s',
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 600,
              color: active ? '#34D399' : '#6EE7B7',
            }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
