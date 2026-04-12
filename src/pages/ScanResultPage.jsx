import { useLocation, useNavigate } from 'react-router-dom';
import { BinBadge } from '../components/BinBadge';
import { loadSettings } from '../utils/storage';
import { getSortingProfile } from '../data/sortingRules';

const f1 = "'Bricolage Grotesque', sans-serif";
const f2 = "'DM Sans', sans-serif";

export default function ScanResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, image, label } = location.state || {};
  const settings = loadSettings();
  const profile = getSortingProfile(settings.postalCode);

  if (!result) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#6EE7B7', fontFamily: f2 }}>Aucun résultat.</p>
        <button onClick={() => navigate('/')} style={{
          marginTop: 16, padding: '10px 20px',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          border: 'none', borderRadius: 12, color: '#fff',
          fontFamily: f1, fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>Retour</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate('/')} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
          color: '#A7F3D0', fontSize: 12, fontFamily: f2,
        }}>← Retour</button>
        <h2 style={{ fontFamily: f1, fontSize: 17, fontWeight: 700, color: '#ECFDF5', margin: 0 }}>
          Résultat
        </h2>
        {settings.postalCode && (
          <span style={{
            marginLeft: 'auto', fontFamily: f2, fontSize: 10,
            color: '#6EE7B7', background: 'rgba(52,211,153,0.1)',
            padding: '3px 8px', borderRadius: 6,
          }}>📍 {settings.postalCode}</span>
        )}
      </div>

      {/* Image preview */}
      {image && (
        <div style={{
          width: '100%', borderRadius: 16, overflow: 'hidden',
          maxHeight: 160, border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Demo label */}
      {!image && label && (
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 12,
          padding: '12px 16px', textAlign: 'center',
          fontFamily: f1, fontSize: 18, color: '#ECFDF5',
        }}>{label}</div>
      )}

      {/* Confidence */}
      {result.confidence != null && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px', background: 'rgba(255,255,255,0.03)',
          borderRadius: 8, width: 'fit-content',
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: result.confidence > 0.7 ? '#34D399' : result.confidence > 0.4 ? '#FBBF24' : '#F87171',
          }} />
          <span style={{ fontFamily: f2, fontSize: 11, color: '#A7F3D0', fontWeight: 500 }}>
            Confiance : {Math.round(result.confidence * 100)}%
          </span>
        </div>
      )}

      {/* Items */}
      {result.items?.map((item, i) => {
        const localRule = profile.rules?.[item.bin];
        return (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
            animation: `slideUp 0.4s ease ${i * 0.1}s both`,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', flexWrap: 'wrap', gap: 8,
            }}>
              <div>
                <h3 style={{
                  fontFamily: f1, fontSize: 17, fontWeight: 800, color: '#ECFDF5',
                  margin: '0 0 4px', textTransform: 'capitalize',
                }}>{item.name}</h3>
                <span style={{
                  fontFamily: f2, fontSize: 10, color: '#6EE7B7', fontWeight: 500,
                  background: 'rgba(52, 211, 153, 0.1)', padding: '2px 8px', borderRadius: 6,
                }}>{item.material}</span>
              </div>
              <BinBadge bin={item.bin} large />
            </div>

            {/* Instruction */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(52, 211, 153, 0.12)',
              borderRadius: 10, padding: '10px 12px',
            }}>
              <div style={{
                fontFamily: f2, fontSize: 9, color: '#34D399',
                fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: 4,
              }}>📋 Consigne de tri</div>
              <p style={{
                fontFamily: f2, fontSize: 13, color: '#D1FAE5',
                margin: 0, lineHeight: 1.6,
              }}>{item.instruction}</p>
            </div>

            {/* Local tip from postal code profile */}
            {localRule?.tip && (
              <div style={{
                display: 'flex', gap: 7, alignItems: 'flex-start',
                padding: '8px 10px',
                background: 'rgba(59, 130, 246, 0.06)',
                border: '1px solid rgba(59, 130, 246, 0.12)',
                borderRadius: 8,
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>📍</span>
                <p style={{
                  fontFamily: f2, fontSize: 11, color: '#93C5FD',
                  margin: 0, lineHeight: 1.5,
                }}>
                  <strong>{profile.name}</strong> : {localRule.tip}
                </p>
              </div>
            )}

            {/* Eco tip */}
            {item.tip && (
              <div style={{
                display: 'flex', gap: 7, alignItems: 'flex-start',
                padding: '8px 10px', background: 'rgba(251, 191, 36, 0.05)',
                border: '1px solid rgba(251, 191, 36, 0.1)', borderRadius: 8,
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>🌍</span>
                <p style={{
                  fontFamily: f2, fontSize: 11, color: '#FDE68A',
                  margin: 0, lineHeight: 1.5,
                }}>{item.tip}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* New scan */}
      <label style={{
        width: '100%', padding: '13px',
        background: 'linear-gradient(135deg, #10B981, #059669)',
        borderRadius: 12, cursor: 'pointer',
        fontFamily: f1, fontSize: 14, fontWeight: 700, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
        position: 'relative', overflow: 'hidden',
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target?.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              navigate('/', { state: { autoScan: ev.target.result } });
            };
            reader.readAsDataURL(file);
          }}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', zIndex: 2,
          }}
        />
        📷 Nouveau scan
      </label>

      <button
        onClick={() => navigate('/')}
        style={{
          width: '100%', padding: '12px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, cursor: 'pointer',
          fontFamily: f2, fontSize: 13, fontWeight: 600, color: '#6EE7B7',
        }}
      >Retour à l'accueil</button>
    </div>
  );
}
