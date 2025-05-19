// src/routes/Route.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import InterestModal from '../pages/InterestModal';
import MainPage from '../pages/MainPage';
import GlobalIssuePage from '../pages/GlobalIssuePage';
import ActivityPage from '../pages/ActivityPage';
import ReviewBoardPage from '../pages/board/ReviewBoardPage';
import FreeBoardPage from '../pages/board/FreeBoardPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/interest" element={<InterestModal />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/global-issue" element={<GlobalIssuePage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/board/review" element={<ReviewBoardPage />} />
      <Route path="/board/free" element={<FreeBoardPage />} />
    </Routes>
  );
}
