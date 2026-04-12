import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BinBadge } from '../components/BinBadge';
import { loadHistory, clearHistory } from '../utils/storage';

const f1 = "'Bricolage Grotesque', sans-serif";
const f2 = "'DM Sans', sans-serif";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    setShowConfirm(false);
  };

  return (
    <div style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: f1, fontSize: 20, fontWeight: 800, color: '#ECFDF5', margin: 0 }}>
          📋 Historique
        </h2>
        {history.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
              fontFamily: f2, fontSize: 11, color: '#FCA5A5', fontWeight: 600,
            }}
          >Effacer tout</button>
        )}
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 12, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <p style={{ fontFamily: f2, fontSize: 13, color: '#FCA5A5', margin: 0 }}>
            Supprimer tout l'historique ? Cette action est irréversible.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleClear} style={{
              flex: 1, padding: '8px',
              background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 8, cursor: 'pointer',
              fontFamily: f2, fontSize: 12, fontWeight: 700, color: '#FCA5A5',
            }}>Oui, supprimer</button>
            <button onClick={() => setShowConfirm(false)} style={{
              flex: 1, padding: '8px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, cursor: 'pointer',
              fontFamily: f2, fontSize: 12, fontWeight: 600, color: '#A7F3D0',
            }}>Annuler</button>
          </div>
        </div>
      )}

      {/* Stats */}
      {history.length > 0 && (
        <div style={{
          display: 'flex', gap: 8, width: '100%',
        }}>
          {(() => {
            const binCounts = {};
            history.forEach(entry => {
              entry.result?.items?.forEach(item => {
                binCounts[item.bin] = (binCounts[item.bin] || 0) + 1;
              });
            });
            const sorted = Object.entries(binCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
            return sorted.map(([bin, count]) => (
              <div key={bin} style={{
                flex: 1, background: 'rgba(255,255,255,0.04)',
                borderRadius: 10, padding: '8px 10px', textAlign: 'center',
              }}>
                <BinBadge bin={bin} />
                <div style={{
                  fontFamily: f2, fontSize: 11, color: '#6EE7B7',
                  marginTop: 4,
                }}>×{count}</div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* List */}
      {history.map((entry) => (
        <button
          key={entry.id}
          onClick={() => navigate('/result', {
            state: { result: entry.result, label: entry.label }
          })}
          style={{
            display: 'flex', gap: 10, alignItems: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 10, cursor: 'pointer',
            textAlign: 'left', width: '100%',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.2)', fontSize: 20,
          }}>
            {entry.thumbnail
              ? <img src={entry.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (entry.label?.split(' ')[0] || '📦')
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: f1, fontSize: 13, fontWeight: 700, color: '#ECFDF5',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {entry.result?.items?.map(i => i.name).join(', ') || 'Scan'}
            </div>
            <div style={{
              fontFamily: f2, fontSize: 10, color: '#6EE7B7', marginTop: 2,
            }}>{entry.dateDisplay}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
              {entry.result?.items?.map((item, j) => (
                <BinBadge key={j} bin={item.bin} />
              ))}
            </div>
          </div>
          <span style={{ color: '#6EE7B7', fontSize: 12, flexShrink: 0 }}>→</span>
        </button>
      ))}

      {history.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p style={{
            fontFamily: f1, fontSize: 16, fontWeight: 700, color: '#ECFDF5',
            margin: '0 0 6px',
          }}>Aucun scan encore</p>
          <p style={{
            fontFamily: f2, fontSize: 13, color: '#6EE7B7', margin: '0 0 16px',
          }}>Scannez votre premier déchet pour commencer !</p>
          <button onClick={() => navigate('/')} style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            border: 'none', borderRadius: 12, cursor: 'pointer',
            fontFamily: f1, fontSize: 14, fontWeight: 700, color: '#fff',
          }}>📷 Scanner</button>
        </div>
      )}
    </div>
  );
}
