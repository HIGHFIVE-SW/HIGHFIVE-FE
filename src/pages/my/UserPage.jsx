import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import ActivityTypeChart from '../../components/my/ActivityTypeChart';
import ActivityTrendChart from '../../components/my/ActivityTrendChart';
import MyPostList from '../../components/my/MyPostList';
import defaultProfile from '../../assets/images/profile/DefaultProfile.png';
import masterIcon from '../../assets/images/level/ic_Master.png';

const UserPage = () => {
  useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });}, []);
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state || {};
  const [activeTab, setActiveTab] = React.useState('statistics');
  const currentUser = localStorage.getItem('nickname');

  const profile = {
    nickname: user.nickname || '알 수 없음',
    profileUrl: user.nickname === '추지은' ? user.profileUrl : defaultProfile,
    rankImage: masterIcon,
    level: 'Lv3 글로벌 마스터',
    progress: 80,
    point: user.exp || 1608,
    rank: user.id || 1,
    keyword: user.keyword || '경제',
  };

  const dummyTypeStats = [
    { activityType: 'CONTEST', count: 4 },
    { activityType: 'VOLUNTEER', count: 2 },
    { activityType: 'INTERNSHIP', count: 1 },
    { activityType: 'SUPPORTERS', count: 0 },
  ];

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
            <TitleText>'{profile.nickname}'님의 페이지</TitleText>
            <ProfileWrapper>
              <ProfileImage src={profile.profileUrl} alt="프로필" />
            </ProfileWrapper>
            <Nickname>{profile.nickname}</Nickname>
            <KeywordTag>#{profile.keyword}</KeywordTag>
            
            <Card>
              <CardTitle>나의 등급</CardTitle>
              <LevelImage src={profile.rankImage} alt="등급" />
              <LevelText>{profile.level}</LevelText>
              <ProgressWrapper>
                <ProgressBar style={{ width: `${profile.progress}%` }} />
              </ProgressWrapper>
              <ProgressLabel>Lv4 유니버스 리더</ProgressLabel>
            </Card>
            
            <Card>
              <CardTitle onClick={() => navigate('/ranking')}
                style={{ cursor: 'pointer' }}>랭킹</CardTitle>
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
                <Tab
                  active={activeTab === 'statistics'}
                  onClick={() => setActiveTab('statistics')}
                >
                  활동 통계
                </Tab>
                <Tab
                  active={activeTab === 'posts'}
                  onClick={() => setActiveTab('posts')}
                >
                  작성한 글
                </Tab>
              </Tabs>
            </TabsWrapper>

            {activeTab === 'statistics' && (
              <GraphSection>
                <ActivityTrendChart />
                <ActivityTypeChart data={dummyTypeStats} />
              </GraphSection>
            )}
            {activeTab === 'posts' && <MyPostList />}
          </RightPanel>
        </PageWrapper>
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
};

export default UserPage;

/* Styled Components - MyPage와 동일한 스타일 적용 */

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
  margin-bottom: 16px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 8px;
  color: #000;
  margin-bottom: 24px;
`;

const Nickname = styled.h3`
  font-size: 20px;
  margin-bottom: 8px;
`;

const KeywordTag = styled.div`
  padding: 4px 12px;
  background-color: white;
  color: #235ba9;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: white;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
  transition: color 0.2s;

  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: ${({ active }) => (active ? '100%' : '0')};
    height: 3px;
    background-color: #235ba9;
    border-radius: 2px;
    transition: width 0.3s;
  }
`;

const GraphSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;
