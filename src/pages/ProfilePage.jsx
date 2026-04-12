import { useState } from 'react';
import { useGamification } from '../hooks/useGamification';
import { loadSettings, saveSettings } from '../utils/storage';
import { getDepartmentFromPostal } from '../data/sortingRules';

const f1 = "'Bricolage Grotesque', sans-serif";
const f2 = "'DM Sans', sans-serif";

export default function ProfilePage() {
  const g = useGamification();
  const level = g.getLevel();
  const [settings, setSettings] = useState(loadSettings);
  const [showApiInput, setShowApiInput] = useState(false);
  const dept = getDepartmentFromPostal(settings.postalCode);

  const handleSaveApiKey = (key) => {
    const updated = { ...settings, apiKey: key };
    setSettings(updated);
    saveSettings(updated);
    setShowApiInput(false);
  };

  return (
    <div style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Header Card ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.08))',
        border: '1px solid rgba(52, 211, 153, 0.2)',
        borderRadius: 20, padding: '20px 18px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, margin: '0 auto 12px',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
        }}>🏆</div>

        <h2 style={{
          fontFamily: f1, fontSize: 22, fontWeight: 800, color: '#ECFDF5', margin: '0 0 2px',
        }}>Niveau {level.level}</h2>
        <p style={{
          fontFamily: f2, fontSize: 14, color: '#34D399', fontWeight: 600, margin: '0 0 12px',
        }}>{level.name}</p>

        {/* XP bar */}
        <div style={{
          width: '100%', height: 8, background: 'rgba(52, 211, 153, 0.15)',
          borderRadius: 4, overflow: 'hidden', marginBottom: 6,
        }}>
          <div style={{
            width: `${Math.min(level.progress * 100, 100)}%`, height: '100%',
            background: 'linear-gradient(90deg, #10B981, #34D399)',
            borderRadius: 4, transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: f2, fontSize: 11, color: '#6EE7B7' }}>
            {g.xp} XP
          </span>
          {level.nextLevel && (
            <span style={{ fontFamily: f2, fontSize: 11, color: '#6EE7B7' }}>
              Prochain : {level.nextLevel.minXp} XP
            </span>
          )}
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { value: g.totalScans, label: 'Scans', icon: '📸' },
          { value: g.streak, label: 'Streak', icon: '🔥' },
          { value: g.unlockedBadges.length, label: 'Badges', icon: '🏅' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 14, padding: '14px 10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{
              fontFamily: f1, fontSize: 22, fontWeight: 800, color: '#ECFDF5',
            }}>{stat.value}</div>
            <div style={{
              fontFamily: f2, fontSize: 10, color: '#6EE7B7', fontWeight: 600,
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Badges ── */}
      <div>
        <h3 style={{
          fontFamily: f1, fontSize: 16, fontWeight: 700, color: '#ECFDF5',
          margin: '0 0 10px',
        }}>🏅 Badges</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {g.allBadges.map(badge => {
            const unlocked = g.unlockedBadges.includes(badge.id);
            return (
              <div key={badge.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: unlocked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${unlocked ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 12, padding: '10px 14px',
                opacity: unlocked ? 1 : 0.45,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: unlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>{badge.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: f1, fontSize: 13, fontWeight: 700,
                    color: unlocked ? '#ECFDF5' : '#6EE7B7',
                  }}>{badge.name}</div>
                  <div style={{
                    fontFamily: f2, fontSize: 11, color: '#6EE7B7', marginTop: 1,
                  }}>{badge.desc}</div>
                </div>
                <div style={{
                  fontFamily: f2, fontSize: 11, fontWeight: 600,
                  color: unlocked ? '#34D399' : '#6EE7B7',
                }}>
                  {unlocked ? '✓' : `+${badge.xp} XP`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Settings ── */}
      <div>
        <h3 style={{
          fontFamily: f1, fontSize: 16, fontWeight: 700, color: '#ECFDF5',
          margin: '0 0 10px',
        }}>⚙️ Paramètres</h3>

        {/* Postal code */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12, padding: '12px 14px', marginBottom: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: f2, fontSize: 12, color: '#6EE7B7', fontWeight: 600 }}>
              📍 Code postal
            </div>
            <div style={{ fontFamily: f2, fontSize: 14, color: '#ECFDF5', marginTop: 2 }}>
              {settings.postalCode || 'Non défini'} {dept ? `(${dept})` : ''}
            </div>
          </div>
        </div>

        {/* API Key (pour auto-hébergement) */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12, padding: '12px 14px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
          }} onClick={() => setShowApiInput(!showApiInput)}>
            <div>
              <div style={{ fontFamily: f2, fontSize: 12, color: '#6EE7B7', fontWeight: 600 }}>
                🔑 Clé API Anthropic
              </div>
              <div style={{ fontFamily: f2, fontSize: 11, color: '#A7F3D0', marginTop: 2 }}>
                {settings.apiKey ? '••••••••' + settings.apiKey.slice(-4) : 'Optionnel (auto-hébergement)'}
              </div>
            </div>
            <span style={{ color: '#6EE7B7', fontSize: 12 }}>
              {showApiInput ? '▲' : '▼'}
            </span>
          </div>

          {showApiInput && (
            <div style={{ marginTop: 10 }}>
              <input
                type="password"
                defaultValue={settings.apiKey}
                placeholder="sk-ant-..."
                id="api-key-input"
                style={{
                  width: '100%', padding: '8px 12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  borderRadius: 8, color: '#ECFDF5', fontSize: 13,
                  fontFamily: 'monospace', outline: 'none',
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById('api-key-input');
                  if (input) handleSaveApiKey(input.value);
                }}
                style={{
                  marginTop: 6, width: '100%', padding: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  borderRadius: 8, cursor: 'pointer',
                  fontFamily: f2, fontSize: 12, fontWeight: 600, color: '#34D399',
                }}
              >Enregistrer</button>
              <p style={{
                fontFamily: f2, fontSize: 10, color: '#6EE7B7',
                margin: '6px 0 0', lineHeight: 1.4, opacity: 0.7,
              }}>
                Stockée localement sur votre appareil. Jamais envoyée à nos serveurs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Version */}
      <div style={{
        textAlign: 'center', padding: '10px 0',
        fontFamily: f2, fontSize: 10, color: 'rgba(167, 243, 208, 0.3)',
      }}>
        TriScan PWA v1.0.0 — Made with 🌿 in France
      </div>
    </div>
  );
}
