import React, { useState } from 'react';
import ActivityTypeChart from '../components/mypage/ActivityTypeChart';
import ActivityTrendChart from '../components/mypage/ActivityTrendChart';
import BookmarkList from '../components/mypage/BookmarkList';
import styled from 'styled-components';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('statistics');

  const dummyProfile = {
    nickname: 'JUDY',
    keyword: '환경',
    profileUrl: require('../assets/images/level/ic_Judy.png'),
    rankImage: require('../assets/images/level/ic_Pro.png'),
    level: 'Lv2 프로 탐험가',
    progress: 80,
    point: 1608,
    rank: 1,
  };

  const dummyTypeStats = [
    { activityType: 'CONTEST', count: 4 },
    { activityType: 'VOLUNTEER', count: 2 },
    { activityType: 'INTERNSHIP', count: 1 },
    { activityType: 'SUPPORTERS', count: 0 },
  ];

  const bookmarkedIssues = [
    { id: 1, title: '관광 공공 데이터 공모전 나갈 사람?', category: '환경', date: '2025.04.14' },
    { id: 2, title: '관광 공공 데이터 공모전 나갈 사람?', category: '환경', date: '2025.04.14' },
  ];
  
  const bookmarkedActivities = [
    { id: 1, title: '관광 공공 데이터 공모전 나갈 사람?', category: '#경제 #공모전', date: '2025.04.14' },
    { id: 2, title: '관광 공공 데이터 공모전 나갈 사람?', category: '#경제 #공모전', date: '2025.04.14' },
  ];
  return (
    <PageContainer>
      <MainNav />
      <ContentWrapper>
        <PageWrapper>
          <LeftPanel>
            <ProfileImage src={dummyProfile.profileUrl} alt="프로필 이미지" />
            <Nickname>{dummyProfile.nickname}</Nickname>
            <KeywordTag>#{dummyProfile.keyword}</KeywordTag>
            <Card>
              <CardTitle>나의 등급</CardTitle>
              <LevelImage src={dummyProfile.rankImage} alt="등급 이미지" />
              <LevelText>{dummyProfile.level}</LevelText>
              <ProgressWrapper>
                <ProgressBar style={{ width: `${dummyProfile.progress}%` }} />
              </ProgressWrapper>
              <ProgressLabel>Lv3 글로벌 마스터</ProgressLabel>
            </Card>
            <Card>
              <CardTitle>랭킹</CardTitle>
              <LevelImage src={dummyProfile.rankImage} alt="등급 이미지" />
              <LevelText>{dummyProfile.level}</LevelText>
              <RankRow>
                <RankItem>
                  <Label>랭킹</Label>
                  <Value>{dummyProfile.rank}</Value>
                </RankItem>
                <Divider />
                <RankItem>
                  <Label>포인트</Label>
                  <Value>{dummyProfile.point}xp</Value>
                </RankItem>
              </RankRow>
            </Card>
          </LeftPanel>

          <RightPanel>
            <Tabs>
              <Tab active={activeTab === 'statistics'} onClick={() => setActiveTab('statistics')}>
                활동 통계
              </Tab>
              <Tab active={activeTab === 'bookmark'} onClick={() => setActiveTab('bookmark')}>
                북마크
              </Tab>
              <Tab active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
                작성한 글
              </Tab>
            </Tabs>

            {activeTab === 'statistics' && (
              <GraphSection>
                <ActivityTrendChart />
                  <ActivityTypeChart data={dummyTypeStats} />  
              </GraphSection>
            )}

           {activeTab === 'bookmark' && (
            <>
            <BookmarkList
                issueData={bookmarkedIssues}
                activityData={bookmarkedActivities}
                    />
            </>
            )}

            {activeTab === 'posts' && (
              <ContentPlaceholder>작성한 글 목록이 여기에 표시됩니다.</ContentPlaceholder>
            )}
          </RightPanel>
        </PageWrapper>
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
};

export default MyPage;

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

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
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
  margin-top: 50px;
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
  margin-bottom: 12px;
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
  padding: 32px 48px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 50px;
  border-bottom: 2px solid #ddd;
  margin-bottom: 30px;
  margin-left: 60px;
`;

const Tab = styled.div`
  font-weight: 600;
  font-size: 18px;
  padding-bottom: 10px;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? '4px solid #235ba9' : 'none')};
  color: ${({ active }) => (active ? '#235ba9' : '#999')};
`;

const GraphSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const ContentPlaceholder = styled.div`
  padding: 40px;
  text-align: center;
  color: #888;
  background: #f9f9f9;
  border-radius: 12px;
`;