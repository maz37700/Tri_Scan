import { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('triscan_install_dismissed');
    if (dismissed) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('triscan_install_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="install-banner">
      <span style={{ fontSize: 28 }}>📲</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 14, fontWeight: 700, color: '#ECFDF5',
        }}>Installer TriScan</div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: '#6EE7B7',
        }}>Accès rapide depuis votre écran d'accueil</div>
      </div>
      <button
        onClick={handleInstall}
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          border: 'none', borderRadius: 10, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 700, color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >Installer</button>
      <button
        onClick={handleDismiss}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#6EE7B7', fontSize: 18, padding: '4px',
        }}
      >✕</button>
    </div>
  );
}
