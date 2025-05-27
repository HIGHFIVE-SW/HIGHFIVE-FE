// src/pages/RankingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ← 추가
import styled from 'styled-components';

import beginnerIcon from '../assets/images/level/ic_Beginner.png';
import proIcon from '../assets/images/level/ic_Pro.png';
import masterIcon from '../assets/images/level/ic_Master.png';
import leaderIcon from '../assets/images/level/ic_Leader.png';
import judyProfile from '../assets/images/level/ic_Judy.png';
import defaultProfile from '../assets/images/profile/DefaultProfile.png';
import helpIcon from "../assets/images/common/ic_Help.png";
import LevelGuide from '../components/level/LevelGuide';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';

const rankingData = [
  { id: 1, nickname: 'JUDY', exp: 1608, profileUrl: judyProfile },
  { id: 2, nickname: '이서정', exp: 1500, profileUrl: null },
  { id: 3, nickname: '추지은', exp: 1400, profileUrl: masterIcon },
  { id: 4, nickname: '추은송', exp: 1305, profileUrl: null },
  { id: 5, nickname: 'DD', exp: 1008, profileUrl: null },
  { id: 6, nickname: 'EE', exp: 995, profileUrl: null },
  { id: 7, nickname: 'ff', exp: 950, profileUrl: null },
  { id: 8, nickname: 'gg', exp: 889, profileUrl: null },
];

const getRankIcon = (exp) => {
  if (exp >= 3000) return leaderIcon;
  if (exp >= 1500) return masterIcon;
  if (exp >= 200) return proIcon;
  return beginnerIcon;
};

export default function RankingPage() {
  const navigate = useNavigate();  // ← 추가
  const topRanker = rankingData[0];
  const [showGuide, setShowGuide] = useState(false);

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
        <Subtitle>
          활동을 쌓아가며 랭킹을 올리고, 다음 등급으로 넘어가자!
        </Subtitle>
      </HeaderSection>

      <TitleProfile>프로 탐험가들의 랭킹전</TitleProfile>

      <TopRankWrapper>
        <TopRankIcon
          src={getRankIcon(topRanker.exp)}
          alt="Top rank icon"
        />
        <TopRankName>{topRanker.nickname}</TopRankName>
        <TopRankXP>{topRanker.exp}XP</TopRankXP>
      </TopRankWrapper>

      <RankingTable>
        {rankingData.map((user, idx) => (
          <RankItem key={user.id} isTopRank={idx === 0}>
            <RankLeft>
              <RankNumber>{idx + 1}</RankNumber>
              <ProfileWrapper isTopRank={idx === 0}>
                <RankIcon
                  src={user.profileUrl || defaultProfile}
                  alt="user profile"
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
  background-color: ${({ isTopRank }) =>
    isTopRank ? '#235BA94D' : 'transparent'};
  border-radius: 12px;
  box-shadow: ${({ isTopRank }) =>
    isTopRank ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};
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
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${({ isTopRank }) =>
    isTopRank ? '2px solid #235BA9' : 'none'};
`;

const RankIcon = styled.img`
  width: 40px;
  height: 40px;
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
  width: 100px;
  height: 100px;
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
