// src/pages/my/MyPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserProfile } from '../../api/userApi';
import ActivityTypeChart from '../../components/my/ActivityTypeChart';
import ActivityTrendChart from '../../components/my/ActivityTrendChart';
import MyPostList from '../../components/my/MyPostList';
import BookmarkList from '../../components/my/BookmarkList';
import styled from 'styled-components';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';

import DefaultProfile from '../../assets/images/profile/DefaultProfile.png';
import masterIcon from '../../assets/images/level/ic_Master.png';
import profilePencilIcon from '../../assets/images/profile/ic_ProfilePenscil.png';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('statistics');
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState({
    nickname: '',
    keyword: '',
    profileUrl: DefaultProfile,
    rankImage: masterIcon,
    level: 'Lv3 글로벌 마스터',
    progress: 80,
    point: 1608,
    rank: 1,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        console.log('받아온 프로필 데이터:', profileData);
        
        if (profileData) {
          setProfile(prev => ({
            ...prev,
            nickname: profileData.nickname || 'JUDY',
            keyword: profileData.keyword || '환경',
            profileUrl: profileData.profileUrl || DefaultProfile,
          }));
          
          // localStorage에도 저장
          localStorage.setItem('nickname', profileData.nickname || 'JUDY');
          localStorage.setItem('keyword', profileData.keyword || '환경');
          localStorage.setItem('profileUrl', profileData.profileUrl || DefaultProfile);
        }
      } catch (error) {
        console.error('프로필 정보를 가져오는데 실패했습니다:', error);
        // 에러 발생 시 기본값 설정
        setProfile(prev => ({
          ...prev,
          nickname: 'JUDY',
          keyword: '환경',
          profileUrl: DefaultProfile,
        }));
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (location.state) {
      // 페이지 진입 시 최상단으로 스크롤
      window.scrollTo({ top: 0, left: 0 });
      setProfile(prev => ({
        ...prev,
        nickname: location.state.nickname || prev.nickname,
        keyword: location.state.keyword || prev.keyword,
        profileUrl: location.state.profileUrl || prev.profileUrl,
      }));
    }
  }, [location.state]);

  const dummyTypeStats = [
    { activityType: 'CONTEST', count: 4 },
    { activityType: 'VOLUNTEER', count: 2 },
    { activityType: 'INTERNSHIP', count: 1 },
    { activityType: 'SUPPORTERS', count: 0 },
  ];

  const handleTabClick = (tabName) => {
    console.log('탭 클릭됨:', tabName);
    setActiveTab(tabName);
  };

  return (
    <PageContainer>
      <MainNav />
      <ContentWrapper>
        <PageWrapper>
          <LeftPanel>
            <TitleText>마이페이지</TitleText>

            <ProfileWrapper>
              <ProfileImage 
                src={profile.profileUrl} 
                alt="프로필 이미지" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultProfile;
                }}
              />
              <EditIconButton onClick={() => navigate('/profile/edit')}>
                <EditIcon src={profilePencilIcon} alt="편집 아이콘" />
              </EditIconButton>
            </ProfileWrapper>

            <Nickname>{profile.nickname}</Nickname>
            <KeywordTag>#{profile.keyword}</KeywordTag>

            <Card>
              <CardTitle
                onClick={() => navigate('/level')}
                style={{ cursor: 'pointer' }}
              >
                나의 등급
              </CardTitle>
              <LevelImage src={profile.rankImage} alt="등급 이미지" />
              <LevelText>{profile.level}</LevelText>
              <ProgressWrapper>
                <ProgressBar style={{ width: `${profile.progress}%` }} />
              </ProgressWrapper>
              <ProgressLabel>Lv4 유니버스 리더</ProgressLabel>
            </Card>

            <Card>
              <CardTitle
                onClick={() => navigate('/ranking')}
                style={{ cursor: 'pointer' }}
              >
                랭킹
              </CardTitle>
              <LevelImage src={profile.rankImage} alt="등급 이미지" />
              <LevelText>{profile.level}</LevelText>
              <RankRow>
                <RankItem>
                  <Label>랭킹</Label>
                  <Value
                    onClick={() => navigate('/ranking')}
                    style={{ cursor: 'pointer' }}
                  >
                    {profile.rank}
                  </Value>
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
                  onClick={() => handleTabClick('statistics')}
                >
                  활동 통계
                </Tab>
                <Tab
                  active={activeTab === 'bookmark'}
                  onClick={() => handleTabClick('bookmark')}
                >
                  북마크
                </Tab>
                <Tab
                  active={activeTab === 'posts'}
                  onClick={() => handleTabClick('posts')}
                >
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
              {activeTab === 'bookmark' && <BookmarkList />}
              {activeTab === 'posts' && <MyPostList />}
            </ContentSection>
          </RightPanel>
        </PageWrapper>
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
}

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

const TitleText = styled.div`
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 24px;
  color: #000;
  align-self: flex-start;
`;

const ProfileWrapper = styled.div`
  position: relative;
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

const EditIconButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EditIcon = styled.img`
  width: 16px;
  height: 16px;
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
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
  color: #333;
  transition: color 0.2s ease;

  &:hover {
    color: #235ba9;
  }
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
  transition: color 0.2s ease;

  &:hover {
    color: #235ba9;
  }
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
  transition: color 0.2s ease;
  user-select: none;

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
