import { useGamification } from '../hooks/useGamification';

// ── Bin Badge Component ──
const BAC_COLORS = {
  jaune: { bg: '#FCD34D', fg: '#78350F', icon: '♻️', label: 'Bac Jaune' },
  verre: { bg: '#6EE7B7', fg: '#064E3B', icon: '🫙', label: 'Bac Verre' },
  ordures: { bg: '#9CA3AF', fg: '#1F2937', icon: '🗑️', label: 'Ordures Ménagères' },
  compost: { bg: '#A3764A', fg: '#FFFBEB', icon: '🌱', label: 'Composteur' },
  dechetterie: { bg: '#F87171', fg: '#7F1D1D', icon: '🏭', label: 'Déchetterie' },
  special: { bg: '#C084FC', fg: '#3B0764', icon: '⚠️', label: 'Filière Spéciale' },
};

export function BinBadge({ bin, large }) {
  const info = BAC_COLORS[bin] || BAC_COLORS.ordures;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: large ? 10 : 6,
      background: info.bg, color: info.fg,
      padding: large ? '10px 18px' : '5px 12px',
      borderRadius: 50, fontSize: large ? 16 : 13,
      fontWeight: 700, letterSpacing: '0.02em',
    }}>
      <span style={{ fontSize: large ? 22 : 16 }}>{info.icon}</span>
      {info.label}
    </div>
  );
}

export { BAC_COLORS };
