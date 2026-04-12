import { useEffect } from 'react';

export default function BadgeToast({ badge, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!badge) return null;

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #064E3B, #022C22)',
        border: '2px solid rgba(52, 211, 153, 0.4)',
        borderRadius: 20, padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        animation: 'slideUp 0.4s ease',
        cursor: 'pointer',
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 14,
        background: 'rgba(16, 185, 129, 0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, flexShrink: 0,
      }}>{badge.icon}</div>
      <div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, color: '#34D399', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Badge débloqué !</div>
        <div style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 16, fontWeight: 800, color: '#ECFDF5',
          marginTop: 2,
        }}>{badge.name}</div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: '#6EE7B7', marginTop: 2,
        }}>+{badge.xp} XP</div>
      </div>
    </div>
  );
}
