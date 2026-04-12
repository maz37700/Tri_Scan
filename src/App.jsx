import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ScanResultPage from './pages/ScanResultPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import InstallBanner from './components/InstallBanner';
import NavBar from './components/NavBar';
import { GamificationProvider } from './hooks/useGamification';

export default function App() {
  return (
    <GamificationProvider>
      <BrowserRouter>
        <div style={{
          minHeight: '100vh',
          minHeight: '100dvh',
          background: 'linear-gradient(160deg, #022C22 0%, #064E3B 30%, #065F46 60%, #022C22 100%)',
          maxWidth: 480,
          margin: '0 auto',
          position: 'relative',
          paddingBottom: 72,
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/result" element={<ScanResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <NavBar />
          <InstallBanner />
        </div>
      </BrowserRouter>
    </GamificationProvider>
  );
}
