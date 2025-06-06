// src/pages/user/UserPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import ActivityTypeChart from '../../components/my/ActivityTypeChart';
import ActivityTrendChart from '../../components/my/ActivityTrendChart';
import MyPostList from '../../components/my/MyPostList';

import defaultProfile from '../../assets/images/profile/DefaultProfile.png';
import beginnerIcon from '../../assets/images/level/ic_Beginner.png';
import proIcon from '../../assets/images/level/ic_Pro.png';
import masterIcon from '../../assets/images/level/ic_Master.png';
import leaderIcon from '../../assets/images/level/ic_Leader.png';

const getLevelInfo = (exp) => {
  if (exp >= 4000) return { label: 'Lv4 유니버스 리더', icon: leaderIcon };
  if (exp >= 2000) return { label: 'Lv3 글로벌 마스터', icon: masterIcon };
  if (exp >= 500) return { label: 'Lv2 프로 탐험가들', icon: proIcon };
  return { label: 'Lv1 초보 여행가', icon: beginnerIcon };
};

const getNextLevelInfo = (exp) => {
  if (exp < 500) return { label: 'Lv2 프로 탐험가들', icon: proIcon };
  if (exp < 2000) return { label: 'Lv3 글로벌 마스터', icon: masterIcon };
  if (exp < 4000) return { label: 'Lv4 유니버스 리더', icon: leaderIcon };
  return { label: '최고 랭킹 달성', icon: leaderIcon };
};

const calcProgressPercent = (exp) => {
  const thresholds = [0, 500, 2000, 4000];
  let prev = 0, next = 500;

  if (exp < thresholds[1]) [prev, next] = [thresholds[0], thresholds[1]];
  else if (exp < thresholds[2]) [prev, next] = [thresholds[1], thresholds[2]];
  else if (exp < thresholds[3]) [prev, next] = [thresholds[2], thresholds[3]];
  else return 100;

  return Math.min(100, Math.floor(((exp - prev) / (next - prev)) * 100));
};

const UserPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('statistics');
  const [imageError, setImageError] = useState(false);

  const user = state || {};
  const currentUser = localStorage.getItem('nickname');
  const exp = user.exp || 0;
  const levelInfo = getLevelInfo(exp);

  const profile = {
    nickname: user.nickname || '알 수 없음',
    profileUrl: user.profileUrl || defaultProfile,
    rankImage: levelInfo.icon,
    level: levelInfo.label,
    progress: calcProgressPercent(exp),
    point: exp,
    rank: user.ranking ?? 0,
    keyword: user.keyword || '환경',
  };

  const dummyTypeStats = [
    { activityType: 'CONTEST', count: 4 },
    { activityType: 'VOLUNTEER', count: 2 },
    { activityType: 'INTERNSHIP', count: 1 },
    { activityType: 'SUPPORTERS', count: 0 },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    if (profile.nickname === currentUser) {
      navigate('/mypage', { replace: true });
    }
  }, [profile.nickname, currentUser, navigate]);

  const handleTabClick = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  const handleRankingClick = useCallback(() => {
    navigate('/ranking');
  }, [navigate]);

  const handleImageError = useCallback((e) => {
    setImageError(true);
    e.target.src = defaultProfile;
  }, []);

  if (profile.nickname === currentUser) return null;

  return (
    <PageContainer>
      <MainNav />
      <ContentWrapper>
        <PageWrapper>
          <LeftPanel>
            <TitleText>'{profile.nickname}'님의 페이지</TitleText>

            <ProfileWrapper>
              <ProfileImage
                src={imageError ? defaultProfile : profile.profileUrl}
                alt={`${profile.nickname} 프로필`}
                onError={handleImageError}
              />
            </ProfileWrapper>

            <Nickname>{profile.nickname}</Nickname>
            <KeywordTag>#{profile.keyword}</KeywordTag>

            <Card>
              <CardTitle>등급 정보</CardTitle>
              <LevelImage src={profile.rankImage} alt="등급 아이콘" />
              <LevelText>{profile.level}</LevelText>
              <ProgressWrapper>
                <ProgressBar style={{ width: `${profile.progress}%` }} />
              </ProgressWrapper>
              <ProgressLabel>{getNextLevelInfo(profile.point).label}</ProgressLabel>
            </Card>

            <Card>
              <CardTitle onClick={handleRankingClick} style={{ cursor: 'pointer' }}>
                랭킹 정보
              </CardTitle>
              <LevelImage src={profile.rankImage} alt="등급 아이콘" />
              <LevelText>{profile.level}</LevelText>
              <RankRow>
                <RankItem>
                  <Label>랭킹</Label>
                  <Value>{profile.rank}</Value>
                </RankItem>
                <Divider />
                <RankItem>
                  <Label>포인트</Label>
                  <Value>{profile.point}xp</Value>
                </RankItem>
              </RankRow>
            </Card>
          </LeftPanel>

          <RightPanel>
            <TabsWrapper>
              <Tabs>
                <Tab active={activeTab === 'statistics'} onClick={() => handleTabClick('statistics')}>
                  활동 통계
                </Tab>
                <Tab active={activeTab === 'posts'} onClick={() => handleTabClick('posts')}>
                  작성한 글
                </Tab>
              </Tabs>
            </TabsWrapper>

            <ContentSection>
              {activeTab === 'statistics' && (
                <GraphSection>
                  <ActivityTrendChart />
                  <ActivityTypeChart data={dummyTypeStats} />
                </GraphSection>
              )}
              {activeTab === 'posts' && <MyPostList />}
            </ContentSection>
          </RightPanel>
        </PageWrapper>
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
};

export default UserPage;

/* Styled Components */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
`;

const ContentWrapper = styled.main`
  flex: 1;
  display: flex;
`;

const PageWrapper = styled.div`
  display: flex;
  font-family: 'NotoSansCustom', -apple-system, BlinkMacSystemFont, sans-serif;
  width: 100%;
  min-height: calc(100vh - 80px);
`;

const LeftPanel = styled.div`
  width: 300px;
  background: #f6faff;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #e8e8e8;
`;

const ProfileWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const TitleText = styled.div`
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 24px;
  color: #000;
  text-align: center;
`;

const Nickname = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
`;

const KeywordTag = styled.div`
  padding: 4px 12px;
  background-color: white;
  color: #235ba9;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  border: 1px solid rgba(35, 91, 169, 0.2);
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  text-align: center;
`;

const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
  color: #333;
  cursor: pointer;
`;

const LevelImage = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
`;

const LevelText = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  height: 12px;
  background-color: #eee;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 6px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #235ba9 0%, #4a90e2 100%);
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 22px;
`;

const RankRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const RankItem = styled.div`
  text-align: center;
  margin-bottom: 22px;
`;

const Label = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Divider = styled.div`
  height: 36px;
  width: 1px;
  background-color: #ddd;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 32px 48px;
  background-color: #fff;
`;

const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #ddd;
  width: fit-content;
  margin: 0 auto;
`;

const Tab = styled.div`
  position: relative;
  padding: 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#235ba9' : '#999')};
  cursor: pointer;

  &:hover {
    color: ${({ active }) => (active ? '#235ba9' : '#666')};
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: ${({ active }) => (active ? '100%' : '0')};
    height: 3px;
    background-color: #235ba9;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const ContentSection = styled.div`
  min-height: 400px;
`;

const GraphSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;
