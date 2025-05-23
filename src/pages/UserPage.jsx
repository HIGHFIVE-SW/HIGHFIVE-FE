import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import ActivityTypeChart from '../components/mypage/ActivityTypeChart';
import ActivityTrendChart from '../components/mypage/ActivityTrendChart';
import MyPostList from '../components/mypage/MyPostList';

import defaultProfileImg from '../assets/images/nav/DefaultProfile.png';
import rankImg from '../assets/images/level/ic_Master.png';

const UserPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state || {};
  const [activeTab, setActiveTab] = useState('statistics');
  const tabsRef = useRef({});
  const [barLeft, setBarLeft] = useState(0);
  const currentUser = localStorage.getItem('nickname');

  const profile = {
    nickname: user.nickname || '알 수 없음',
    profileUrl: user.nickname === '추지은' ? user.profileUrl : defaultProfileImg,
    rankImage: rankImg,
    level: 'Lv3 글로벌 마스터',
    progress: 80,
    point: user.exp || 1608,
    rank: user.id || 1,
    keyword: user.keyword || '경제',
  };

  useEffect(() => {
    if (tabsRef.current[activeTab]) {
      setBarLeft(
        tabsRef.current[activeTab].offsetLeft +
        (tabsRef.current[activeTab].offsetWidth - 60) / 2
      );
    }
  }, [activeTab]);

  if (profile.nickname === currentUser) {
    navigate('/mypage');
    return null;
  }

  return (
    <PageContainer>
      <MainNav />
      <ContentWrapper>
        <PageWrapper>
          <LeftPanel>
            <ProfileWrapper>
              <ProfileImage src={profile.profileUrl} alt="프로필" />
            </ProfileWrapper>
            <TitleText>'{profile.nickname}'님의 페이지</TitleText>
            <Nickname>{profile.nickname}</Nickname>
            <KeywordTag>#{profile.keyword}</KeywordTag>
            <Card>
              <CardTitle>나의 등급</CardTitle>
              <LevelImage src={profile.rankImage} alt="등급" />
              <LevelText>{profile.level}</LevelText>
              <ProgressWrapper>
                <ProgressBar style={{ width: `${profile.progress}%` }} />
              </ProgressWrapper>
              <ProgressLabel>Lv4 준비</ProgressLabel>
            </Card>
            <Card>
              <CardTitle>랭킹</CardTitle>
              <LevelImage src={profile.rankImage} alt="등급 이미지" />
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
                <Tab ref={el => (tabsRef.current['statistics'] = el)} active={activeTab === 'statistics'} onClick={() => setActiveTab('statistics')}>활동 통계</Tab>
                <Tab ref={el => (tabsRef.current['posts'] = el)} active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>작성한 글</Tab>
              </Tabs>
              <Underline />
              <ActiveBar style={{ left: `${barLeft}px` }} />
            </TabsWrapper>

            {activeTab === 'statistics' && (
              <StatisticsPanel>
                <ActivityTrendChart />
                <ActivityTypeChart />
              </StatisticsPanel>
            )}

            {activeTab === 'posts' && (
              <PostPanel>
                <MyPostList />
              </PostPanel>
            )}
          </RightPanel>
        </PageWrapper>
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
};

export default UserPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex: 1;
  display: flex;
`;

const PageWrapper = styled.div`
  display: flex;
  font-family: 'NotoSansCustom';
`;

const LeftPanel = styled.div`
  width: 300px;
  background: #f6faff;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const TitleText = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 8px;
`;

const Nickname = styled.h3`
  font-size: 20px;
  margin-bottom: 8px;
`;

const KeywordTag = styled.div`
  padding: 4px 12px;
  background-color: #ffffff;
  color: #235ba9;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
`;

const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const LevelImage = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
`;

const LevelText = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 15px;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  height: 12px;
  background-color: #eee;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #235ba9;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const RankRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
`;

const RankItem = styled.div`
  text-align: center;
`;

const Label = styled.div`
  font-size: 14px;
  color: #666;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 4px;
`;

const Divider = styled.div`
  height: 36px;
  width: 1px;
  background-color: #ccc;
`;

const RightPanel = styled.div`
  flex: 1;
  width: 125%;
  margin-right: -10%;
`;

const StatisticsPanel = styled.div`
  width: 100%;
  padding-right: 0px;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const PostPanel = styled.div`
  width: 110%;
  margin-left: 3%;
`;

const TabsWrapper = styled.div`
  position: relative;
  margin-bottom: 30px;
  margin-left: 170px;
  margin-top: 20px;
`;

const Tabs = styled.div`
  display: flex;
`;

const Tab = styled.div`
  font-weight: 600;
  font-size: 22px;
  padding-bottom: 10px;
  margin-left: 140px;
  cursor: pointer;
  color: ${({ active }) => (active ? '#235ba9' : '#999')};
  position: relative;
  z-index: 1;
`;

const Underline = styled.div`
  position: absolute;
  bottom: 0;
  width: 280px;
  height: 1px;
  background-color: #ccc;
  margin-left: 20%;
`;

const ActiveBar = styled.div`
  position: absolute;
  bottom: -1px;
  height: 3px;
  width: 100px;
  background-color: #235BA9;
  border-radius: 999px;
  transition: left 0.3s ease;
`;