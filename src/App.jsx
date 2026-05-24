import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { MessengerProvider } from './context/MessengerContext';
import MainLayout from './components/layout/MainLayout';
import MarketplaceHome from './components/home/MarketplaceHome';
import HistoryChecker from './components/HistoryChecker';
import GutuOCR from './components/GutuOCR';
import PartSentry from './components/PartSentry';
import SafePay from './components/SafePay';
import GutuAI from './components/GutuAI';
import GaragePortal from './components/GaragePortal';
import CorporatePortal from './components/CorporatePortal';
import GovernmentPortal from './components/GovernmentPortal';
import ContentPage from './components/ContentPage';
import Compare from './components/Compare';
import DealerProfile from './components/DealerProfile';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Consumer Routes */}
        <Route index element={<MarketplaceHome />} />
        <Route path="passport" element={<HistoryChecker />} />
        <Route path="ocr" element={<GutuOCR />} />
        <Route path="partsentry" element={<PartSentry />} />
        <Route path="safepay" element={<SafePay />} />
        <Route path="compare" element={<Compare />} />
        <Route path="dealer/:id" element={<DealerProfile />} />
        
        {/* Portals */}
        <Route path="garage" element={<GaragePortal />} />
        <Route path="corporate" element={<CorporatePortal />} />
        <Route path="government" element={<GovernmentPortal />} />
        
        {/* Global/AI */}
        <Route path="gutu" element={<GutuAI />} />
        <Route path="content/:topic" element={<ContentPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MessengerProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </MessengerProvider>
    </ToastProvider>
  );
}
