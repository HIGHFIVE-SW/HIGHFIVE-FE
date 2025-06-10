// src/routes/Route.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import InterestModal from '../pages/login/InterestModal';
import GlobalIssuePage from '../pages/issue/GlobalIssuePage';
import ActivityPage from '../pages/ActivityPage';
import SearchResultPage from '../pages/main/SearchResultPage';
import MoreGlobalPage from '../pages/main/MoreGlobalPage';
import MoreActivityPage from '../pages/main/MoreActivityPage';
import ReviewBoardPage from '../pages/board/ReviewBoardPage';
import MainPage from '../pages/main/MainPage';
import GlobalIssueDetailPage from '../pages/issue/GlobalIssueDetailPage'; 
import FreeBoardPage from '../pages/board/FreeBoardPage';
import RankingPage from '../pages/RankingPage';
import LevelGuide from '../components/level/LevelGuide';
import Mypage from '../pages/my/MyPage';
import ProfileEditPage from '../pages/my/ProfileEditPage';
import UserPage from '../pages/my/UserPage';
import PostWritePage from '../pages/board/PostWritePage';
import BoardDetailPage from '../pages/board/BoardDetailPage';
import BoardSearchResultPage from '../pages/board/BoardSearchResultPage';
import MoreReviewPage from '../pages/board/MoreReviewPage';
import MoreFreePage from '../pages/board/MoreFreePage';
import PostEditPage from '../pages/board/PostEditPage';
import ReviewEditPage from '../pages/board/ReviewEditPage';

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
      <Route path="/profile/edit" element={<ProfileEditPage />} />

      <Route path="/search" element={<SearchResultPage />} />
      <Route path="/more/global" element={<MoreGlobalPage />} />
      <Route path="/more/activity" element={<MoreActivityPage />} />
      <Route path="/global-issue/:id" element={<GlobalIssueDetailPage />} />
      <Route path="/board/review" element={<ReviewBoardPage />} />
      <Route path="/board/free" element={<FreeBoardPage />} />
      <Route path="/level-guide" element={<LevelGuide />} />

      <Route path="/user" element={<UserPage />} />
      <Route path="/board/write" element={<PostWritePage />} />
      <Route path="/board/detail/:id" element={<BoardDetailPage />} />
      <Route path="/board/review/:id" element={<BoardDetailPage />} />
      <Route path="/board/search" element={<BoardSearchResultPage />} />
      <Route path="/more/review" element={<MoreReviewPage />} />
      <Route path="/more/free" element={<MoreFreePage />} />
      <Route path="/board/edit/:id" element={<PostEditPage />} />
      <Route path="/board/review/edit/:id" element={<ReviewEditPage />} />
    </Routes>
  );
}
