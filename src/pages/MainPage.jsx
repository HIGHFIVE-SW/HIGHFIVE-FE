import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import IssueCard from '../components/IssueCard';
import Chatbot from '../components/chatbot/Chatbot';

import globalIssueImage from '../assets/images/main/ic_GlobalIssue.png';
import issueSampleImage from '../assets/images/main/ic_IssueCardSample.png';
import envCard from '../assets/images/main/EnvironmentButton.png';
import peopleCard from '../assets/images/main/PeopleButton.png';
import economyCard from '../assets/images/main/EconomyButton.png';
import techCard from '../assets/images/main/TechButton.png';

export default function MainPage() {
  const [bookmarked, setBookmarked] = useState(new Array(3).fill(false));
  const navigate = useNavigate();

  const dummyIssues = [
    { title: '글로벌 “관세 전쟁” 공포  \n  … 국내 증시 ‘타격’', tag: '#정치' },
    { title: '글로벌 “관세 전쟁” 공포  \n  … 국내 증시 ‘타격’', tag: '#경제' },
    { title: '글로벌 “관세 전쟁” 공포  \n  … 국내 증시 ‘타격’', tag: '#사회' },
  ];

  const categories = [
    { title: '환경', img: envCard },
    { title: '사람과 사회', img: peopleCard },
    { title: '경제', img: economyCard },
    { title: '기술', img: techCard },
  ];

  const toggleBookmark = (idx) => {
    const updated = [...bookmarked];
    updated[idx] = !updated[idx];
    setBookmarked(updated);
  };

  return (
    <PageWrapper>
      <MainNav />
      <MainContent>
        <HeroSection>
          <HeroInner>
            <HeroLeft>
              <HeroTitle>최신 글로벌 이슈를 알아보자</HeroTitle>
              <HeroLink onClick={() => navigate('/global-issue')}>알아보기 &gt;</HeroLink>
            </HeroLeft>
            <HeroRight>
              <HeroImage src={globalIssueImage} alt="Global Issue" />
            </HeroRight>
          </HeroInner>
        </HeroSection>

        <Wrapper>
          <Title>글로벌 이슈</Title>
          <Subtitle>관심있는 분야의 이슈를 알아보기!</Subtitle>
          <CategoryList>
          {categories.map((item, index) => (
            <Category
              key={index}
              onClick={() => navigate(`/global-issue?query=${item.title}`)}
            >
              <img src={item.img} alt={item.title} />
              <p>{item.title}</p>
            </Category>
          ))}
        </CategoryList>
        </Wrapper>

        <Wrapper>
          <Header>
            <Title>최신 이슈</Title>
            <Subtitle>빠르게 알아보는 글로벌 이슈</Subtitle>
          </Header>
          <MoreLink onClick={() => navigate('/global-issue')}>더보기 &gt;</MoreLink>
          <IssueGrid>
            {dummyIssues.map((item, idx) => (
              <IssueCard
                key={idx}
                title={item.title}
                tag={item.tag}
                image={issueSampleImage}
                bookmarked={bookmarked[idx]}
                onToggle={() => toggleBookmark(idx)}
              />
            ))}
          </IssueGrid>
        </Wrapper>

        <Chatbot />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

const HeroSection = styled.section`
  width: 104%;
  background-color: #F6FAFF;
  display: flex;
  justify-content: center;
  margin-left: -50px;
`;

const HeroInner = styled.div`
  width: 100%;
  height: 530px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeroLeft = styled.div`
  margin-left: 100px;
  font-family: 'NotoSansKR-VariableFont_wght';
`;

const HeroRight = styled.div``;

const HeroTitle = styled.h2`
  font-size: 60px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const HeroLink = styled.p`
  cursor: pointer;
  font-size: 40px;
`;

const HeroImage = styled.img`
  width: 578px;
  height: 578px;
`;

const Wrapper = styled.section`
  width: 100%;
  max-width: 1600px;
  margin: 60px auto;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 50px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 40px;
  color: #666;
  margin: 10px 0 32px;
`;

const CategoryList = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;
  flex-wrap: wrap;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 30px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 305px;
    height: 344px;
    margin-bottom: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: -10px;
`;

const MoreLink = styled.span`
  display: block;
  font-size: 14px;
  cursor: pointer;
  color: #000;
  text-align: right;
  margin-bottom: 16px;
  padding-right: 105px;
`;

const IssueGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 150px;
  flex-wrap: wrap;
  margin-bottom: 150px;
`;