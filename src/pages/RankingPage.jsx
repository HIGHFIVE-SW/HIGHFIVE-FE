import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import beginnerIcon from '../assets/images/level/ic_Beginner.png';
import proIcon from '../assets/images/level/ic_Pro.png';
import masterIcon from '../assets/images/level/ic_Master.png';
import leaderIcon from '../assets/images/level/ic_Leader.png';
import defaultProfile from '../assets/images/profile/DefaultProfile.png';
import helpIcon from "../assets/images/common/ic_Help.png";
import LevelGuide from '../components/level/LevelGuide';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import { getUserProfile, getRankingByTier } from '../api/userApi';

const getLevelInfo = (exp) => {
  if (exp >= 4000)
    return { label: '유니버스 리더의 랭킹전', icon: leaderIcon };
  if (exp >= 2000)
    return { label: '글로벌 마스터의 랭킹전', icon: masterIcon };
  if (exp >= 500)
    return { label: '프로 탐험가들의 랭킹전', icon: proIcon };
  return { label: '초보 여행가의 랭킹전', icon: beginnerIcon };
};

export default function RankingPage() {
  const [rankingData, setRankingData] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const fetchRankingPage = async () => {
      try {
        const profile = await getUserProfile();
        setMyProfile(profile);
        console.log('[내 프로필]', profile);

        const tierKey = profile.tierName?.toLowerCase();
        if (!tierKey) throw new Error('티어 정보가 없음');

        const ranking = await getRankingByTier(tierKey);
        console.log(`[${tierKey} 티어 랭킹 응답]`, ranking);

        const isInRanking = ranking.some(user => user.id === profile.id);
        console.log('내가 랭킹에 포함돼 있는가?', isInRanking);

        const updatedRanking = isInRanking ? ranking : [...ranking, profile];
        const sorted = [...updatedRanking].sort((a, b) => b.exp - a.exp);
        setRankingData(sorted);
      } catch (error) {
        console.error('랭킹 데이터 불러오기 실패:', error.message);
      }
    };

    fetchRankingPage();
  }, []);

  return (
    <PageWrapper>
      <MainNav />

      <HeaderSection>
        <HelpWrapper>
          <HelpIcon
            src={helpIcon}
            alt="도움말"
            onClick={() => setShowGuide(prev => !prev)}
          />
          {showGuide && (
            <Popover>
              <LevelGuide />
            </Popover>
          )}
        </HelpWrapper>

        <Title>랭킹 게시판</Title>
        <Subtitle>활동을 쌓아가며 랭킹을 올리고, 다음 등급으로 넘어가자!</Subtitle>
      </HeaderSection>

      {myProfile && (
        <>
          <TitleProfile>{getLevelInfo(myProfile.exp).label}</TitleProfile>

          <TopRankWrapper>
            <TopRankIcon
              src={getLevelInfo(myProfile.exp).icon}
              alt="My rank icon"
            />
            <TopRankName>{myProfile.nickname}</TopRankName>
            <TopRankXP>{myProfile.exp}XP</TopRankXP>
          </TopRankWrapper>
        </>
      )}

      <RankingTable>
        {rankingData.map((user, idx) => (
          <RankItem key={user.id} isCurrentUser={user.id === myProfile?.id}>
            <RankLeft>
              <RankNumber>{user.ranking ?? '-'}</RankNumber>
              <ProfileWrapper isCurrentUser={user.id === myProfile?.id}>
                <RankIcon
                  src={user.profileUrl === "기본값" ? defaultProfile : user.profileUrl}
                  alt="user profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfile;
                  }}
                />
              </ProfileWrapper>
              <UserName onClick={() => navigate('/user', { state: user })}>
                {user.nickname}
              </UserName>
            </RankLeft>
            <UserXP>{user.exp}XP</UserXP>
          </RankItem>
        ))}
      </RankingTable>

      <Footer />
    </PageWrapper>
  );
}

// 스타일 컴포넌트
const PageWrapper = styled.div`
  position: relative;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background-color: #f9fbff;
  text-align: center;
  padding: 50px 0;
  position: relative;
`;

const Title = styled.h1`
  font-size: 44px;
  color: #000000;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 24px;
  color: #656565;
  margin: 20px 0 0;
`;

const HelpWrapper = styled.div`
  position: absolute;
  top: 24px;
  right: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const HelpIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Popover = styled.div`
  margin-top: 8px;
  z-index: 1000;
`;

const RankingTable = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 60px;
  padding: 0 16px;
`;

const RankItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  background-color: ${({ isCurrentUser }) =>
    isCurrentUser ? '#235BA94D' : 'transparent'};
  border-radius: 12px;
  box-shadow: ${({ isCurrentUser }) =>
    isCurrentUser ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const RankLeft = styled.div`
  display: flex;
  align-items: center;
`;

const RankNumber = styled.span`
  width: 24px;
  font-weight: bold;
`;

const ProfileWrapper = styled.div`
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${({ isCurrentUser }) =>
    isCurrentUser ? '2px solid #235BA9' : '0.1px solid #C4C4C4'};
`;

const RankIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 500;
  margin-left: 23px;
  cursor: pointer;
`;

const UserXP = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #444;
`;

const TopRankWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const TopRankIcon = styled.img`
  width: 10%;
  height: 10%;
  margin-bottom: 8px;
`;

const TopRankName = styled.h3`
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const TopRankXP = styled.span`
  font-size: 16px;
  color: #555;
`;

const TitleProfile = styled.h2`
  margin-top: 40px;
  margin-bottom: 24px;
  font-size: 24px;
  text-align: center;
`;
