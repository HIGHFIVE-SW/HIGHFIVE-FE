import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import IssueCard from '../../components/issue/IssueCard';
import Chatbot from '../../components/chatbot/Chatbot';
import { useIssues, useToggleIssueBookmark } from '../../query/useIssues';

import environmentButton from '../../assets/images/main/EnvironmentButton.png';
import peopleButton from '../../assets/images/main/PeopleButton.png';
import economyButton from '../../assets/images/main/EconomyButton.png';
import techButton from '../../assets/images/main/TechButton.png';
import mainBanner from '../../assets/images/main/mainbanner.png'

export default function MainPage() {
  const navigate = useNavigate();
  const toggleBookmark = useToggleIssueBookmark();

  // 최신 이슈 3개 조회
  const { data: issuesData, isLoading } = useIssues(0);
  const latestIssues = issuesData?.content?.slice(0, 3) || [];

  const categories = [
    { title: '환경', img: environmentButton },
    { title: '사람과 사회', img: peopleButton },
    { title: '경제', img: economyButton },
    { title: '기술', img: techButton },
  ];

  const handleBookmarkToggle = (issueId) => {
    toggleBookmark.mutate(issueId);
  };

  return (
    <PageWrapper>
      <MainNav />
      <MainContent>
      <HeroSection>
        <BannerImage src={mainBanner} alt="Trendist Main Banner" />
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
            {isLoading ? (
              <LoadingText>로딩 중...</LoadingText>
            ) : latestIssues.length > 0 ? (
              latestIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  title={issue.title}
                  tag={issue.category}
                  image={issue.thumbnailUrl}
                  bookmarked={issue.bookmarked}
                  onToggle={() => handleBookmarkToggle(issue.id)}
                />
              ))
            ) : (
              <NoIssuesText>최신 이슈가 없습니다.</NoIssuesText>
            )}
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
  width: 100%;
  background-color: #F6FAFF;
  display: flex;
  justify-content: center;
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
`;

const Wrapper = styled.section`
  width: 100%;
  max-width: 1600px;
  margin: 60px auto;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 30px;
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
  font-size: 25px;
  cursor: pointer;
  transition: transform 0.3s;

  img:hover {
    transform: scale(1.10);
  }

  img {
    width: 230px;
    height: 230px;
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
  padding-right: 180px;
`;

const IssueGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 70px;
  flex-wrap: wrap;
  margin-bottom: 150px;
`;

const LoadingText = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
  color: #666;
`;

const NoIssuesText = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
  color: #666;
`;