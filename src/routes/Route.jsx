// src/routes/Route.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import InterestModal from '../pages/InterestModal';

import GlobalIssuePage from '../pages/GlobalIssuePage';
import ActivityPage from '../pages/ActivityPage';
import SearchResultPage from '../pages/SearchResultPage';
import MoreGlobalPage from '../pages/MoreGlobalPage';
import MoreActivityPage from '../pages/MoreActivityPage';
import ReviewBoardPage from '../pages/board/ReviewBoardPage';
import MainPage from '../pages/Mainpage';
import GlobalIssueDetailPage from '../pages/GlobalIssueDetailPage'; 
import FreeBoardPage from '../pages/board/FreeBoardPage';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/interest" element={<InterestModal />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/global-issue" element={<GlobalIssuePage />} />
      <Route path="/activity" element={<ActivityPage />} />


      <Route path="/search" element={<SearchResultPage />} />
      <Route path="/more/global" element={<MoreGlobalPage />} />
      <Route path="/more/activity" element={<MoreActivityPage />} />
      <Route path="/global-issue/:id" element={<GlobalIssueDetailPage />} />
      <Route path="/board/review" element={<ReviewBoardPage />} />

      <Route path="/board/review" element={<ReviewBoardPage />} />
      <Route path="/board/free" element={<FreeBoardPage />} />

    </Routes>
  );
}
