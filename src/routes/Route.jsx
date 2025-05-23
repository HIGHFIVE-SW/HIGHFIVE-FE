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
import MainPage from '../pages/MainPage';
import GlobalIssueDetailPage from '../pages/GlobalIssueDetailPage'; 
import FreeBoardPage from '../pages/board/FreeBoardPage';
import MoreDetailPage from '../pages/MoreDetailPage';
import RankingPage from '../pages/RankingPage';
import LevelGuide from '../components/level/LevelGuide';
import Mypage from '../pages/MyPage';
import PostWritePage from '../pages/board/PostWritePage';
import BoardDetailPage from '../pages/board/BoardDetailPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/interest" element={<InterestModal />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/global-issue" element={<GlobalIssuePage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/mypage" element={<Mypage />} />

      <Route path="/search" element={<SearchResultPage />} />
      <Route path="/more/global" element={<MoreGlobalPage />} />
      <Route path="/more/activity" element={<MoreActivityPage />} />
      <Route path="/more-detail" element={<MoreDetailPage />} />
      <Route path="/global-issue/:id" element={<GlobalIssueDetailPage />} />
      <Route path="/board/review" element={<ReviewBoardPage />} />
      <Route path="/board/free" element={<FreeBoardPage />} />
      <Route path="/level-guide" element={<LevelGuide />} />
      <Route path="/board/write" element={<PostWritePage />} />
      <Route path="/board/detail/:id" element={<BoardDetailPage />} />
    </Routes>
  );
}
