import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BinBadge } from '../components/BinBadge';
import BadgeToast from '../components/BadgeToast';
import { analyzeWasteImage, DEMO_ITEMS, DEMO_RESULTS } from '../utils/analyzeWaste';
import { saveToHistory, loadSettings, saveSettings } from '../utils/storage';
import { useGamification } from '../hooks/useGamification';
import { getSortingProfile, getDepartmentFromPostal } from '../data/sortingRules';

const ECO_TIPS = [
  '💡 Un Français produit environ 580 kg de déchets par an.',
  '💡 Le verre est recyclable à l\'infini sans perte de qualité.',
  '💡 Depuis 2024, le tri des biodéchets est obligatoire en France.',
  '💡 Une bouteille plastique met 450 ans à se décomposer.',
  '💡 Recycler 1 tonne d\'aluminium économise 95% d\'énergie.',
  '💡 Les médicaments se rapportent TOUJOURS en pharmacie.',
  '💡 Le carton pizza souillé va dans le compost, pas au jaune.',
  '💡 Les textiles se déposent dans les bornes Le Relais ou Eco TLC.',
];

const f1 = "'Bricolage Grotesque', sans-serif";
const f2 = "'DM Sans', sans-serif";

export default function HomePage() {
  const navigate = useNavigate();
  const gamification = useGamification();
  const level = gamification.getLevel();

  const [tipIndex, setTipIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(loadSettings);
  const [showPostalInput, setShowPostalInput] = useState(!settings.postalCode);

  useEffect(() => {
    const interval = setInterval(() => setTipIndex(i => (i + 1) % ECO_TIPS.length), 6000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      processImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageDataUrl) => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeWasteImage(imageDataUrl, settings.apiKey);
      gamification.recordScan(result);
      saveToHistory({ image: imageDataUrl, result });
      // Navigate to result with data
      navigate('/result', { state: { result, image: imageDataUrl } });
    } catch (err) {
      console.error(err);
      setError('Erreur d\'analyse. Vérifiez votre connexion.');
      setAnalyzing(false);
    }
  };

  const handleDemoSelect = (label) => {
    const result = DEMO_RESULTS[label];
    if (result) {
      gamification.recordScan(result);
      saveToHistory({ result, label });
      navigate('/result', { state: { result, label } });
    }
  };

  const handlePostalSave = (code) => {
    const newSettings = { ...settings, postalCode: code };
    setSettings(newSettings);
    saveSettings(newSettings);
    setShowPostalInput(false);
  };

  const dept = getDepartmentFromPostal(settings.postalCode);
  const profile = getSortingProfile(settings.postalCode);

  if (analyzing) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 20, padding: 40, minHeight: '80vh',
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: '50%',
          border: '3px solid rgba(52, 211, 153, 0.2)',
          borderTopColor: '#34D399',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: f1, fontSize: 20, fontWeight: 700, color: '#ECFDF5', margin: '0 0 6px' }}>
            Analyse en cours...
          </h2>
          <p style={{ fontFamily: f2, fontSize: 13, color: '#6EE7B7', margin: 0 }}>
            L'IA identifie votre déchet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 18, padding: '12px 20px 20px',
    }}>
      {/* Badge Toast */}
      {gamification.newBadge && (
        <BadgeToast badge={gamification.newBadge} onDismiss={gamification.dismissBadge} />
      )}

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{
          width: 72, height: 72, margin: '0 auto 10px',
          background: 'linear-gradient(135deg, #10B981, #059669, #047857)',
          borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, boxShadow: '0 8px 32px rgba(16, 185, 129, 0.35)',
          animation: 'float 3s ease-in-out infinite',
        }}>📸</div>
        <h1 style={{
          fontFamily: f1, fontSize: 26, fontWeight: 800, color: '#ECFDF5',
          margin: '0 0 2px', letterSpacing: '-0.02em',
        }}>Tri<span style={{ color: '#34D399' }}>Scan</span></h1>
        <p style={{ fontFamily: f2, fontSize: 12, color: '#6EE7B7', margin: 0, fontWeight: 500 }}>
          Scannez · Identifiez · Triez correctement
        </p>
      </div>

      {/* ── XP Bar ── */}
      <div style={{
        width: '100%', maxWidth: 360,
        background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '10px 14px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontFamily: f1, fontSize: 13, fontWeight: 700, color: '#ECFDF5' }}>
            Niv. {level.level} — {level.name}
          </span>
          <span style={{ fontFamily: f2, fontSize: 11, color: '#34D399', fontWeight: 600 }}>
            {gamification.xp} XP
          </span>
        </div>
        <div style={{
          width: '100%', height: 6, background: 'rgba(52, 211, 153, 0.15)',
          borderRadius: 3, overflow: 'hidden',
        }}>
          <div style={{
            width: `${Math.min(level.progress * 100, 100)}%`, height: '100%',
            background: 'linear-gradient(90deg, #10B981, #34D399)',
            borderRadius: 3, transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontFamily: f2, fontSize: 10, color: '#6EE7B7' }}>
            🔥 {gamification.streak} jour{gamification.streak !== 1 ? 's' : ''} de suite
          </span>
          <span style={{ fontFamily: f2, fontSize: 10, color: '#6EE7B7' }}>
            {gamification.totalScans} scan{gamification.totalScans !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Eco tip ── */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(52, 211, 153, 0.15)',
        borderRadius: 14, padding: '10px 14px', width: '100%', maxWidth: 360,
        minHeight: 40, display: 'flex', alignItems: 'center',
      }}>
        <p key={tipIndex} style={{
          fontFamily: f2, fontSize: 12, color: '#A7F3D0',
          margin: 0, lineHeight: 1.5, textAlign: 'center', width: '100%',
          animation: 'fadeIn 0.5s ease',
        }}>{ECO_TIPS[tipIndex]}</p>
      </div>

      {/* ── Postal code ── */}
      {showPostalInput ? (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <label style={{
            fontFamily: f2, fontSize: 10, color: '#6EE7B7',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>📍 Votre code postal (consignes locales)</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="36000"
              defaultValue={settings.postalCode}
              onKeyDown={e => e.key === 'Enter' && handlePostalSave(e.target.value)}
              id="postal-input"
              style={{
                flex: 1, padding: '10px 14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                borderRadius: 12, color: '#ECFDF5', fontSize: 15,
                fontFamily: f2, outline: 'none', letterSpacing: '0.15em',
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById('postal-input');
                if (input) handlePostalSave(input.value);
              }}
              style={{
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none', borderRadius: 12, cursor: 'pointer',
                fontFamily: f2, fontSize: 13, fontWeight: 700, color: '#fff',
              }}
            >OK</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowPostalInput(true)}
          style={{
            width: '100%', maxWidth: 360,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '8px 14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: f2, fontSize: 12, color: '#6EE7B7',
          }}
        >
          <span>📍</span>
          <span>{settings.postalCode} — {dept || profile.name}</span>
          <span style={{ marginLeft: 'auto', fontSize: 10 }}>modifier</span>
        </button>
      )}

      {/* ── SCAN BUTTON ── */}
      <label style={{
        width: '100%', maxWidth: 360, padding: '16px 24px',
        background: 'linear-gradient(135deg, #10B981, #059669)',
        borderRadius: 20, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)',
        position: 'relative', overflow: 'hidden',
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', zIndex: 2,
          }}
        />
        <span style={{ fontSize: 24 }}>📷</span>
        <span style={{ fontFamily: f1, fontSize: 16, fontWeight: 700, color: '#fff' }}>
          Photo ou galerie
        </span>
      </label>

      {/* ── SEPARATOR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', maxWidth: 360,
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(52, 211, 153, 0.15)' }} />
        <span style={{ fontFamily: f2, fontSize: 10, color: '#6EE7B7', fontWeight: 500 }}>
          ou essayez la démo
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(52, 211, 153, 0.15)' }} />
      </div>

      {/* ── DEMO GRID ── */}
      <div style={{
        width: '100%', maxWidth: 360,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
      }}>
        {DEMO_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleDemoSelect(item.label)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '12px 10px',
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 3,
            }}
          >
            <span style={{ fontFamily: f1, fontSize: 13, fontWeight: 700, color: '#ECFDF5' }}>
              {item.label}
            </span>
            <span style={{ fontFamily: f2, fontSize: 10, color: '#6EE7B7' }}>
              {item.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 10, padding: '10px 14px', width: '100%', maxWidth: 360,
          color: '#FCA5A5', fontSize: 12, fontFamily: f2,
        }}>⚠️ {error}</div>
      )}
    </div>
  );
}
