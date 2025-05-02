import React, { useState } from 'react';
import styled from 'styled-components';
import MainNav from '../layout/MainNav/MainNav';
import Footer from '../layout/footer';

export default function MainPage() {
  const [bookmarked, setBookmarked] = useState(
    new Array(3).fill(false)
  );

  const dummyIssues = [
    { title: '글로벌 “관세 전쟁” 공포… 국내 증시 ‘타격’', tag: '#정치' },
    { title: '글로벌 “관세 전쟁” 공포… 국내 증시 ‘타격’', tag: '#경제' },
    { title: '글로벌 “관세 전쟁” 공포… 국내 증시 ‘타격’', tag: '#사회' },
  ];

  const categories = [
    { title: '환경', img: '/assets/images/environment.png' },
    { title: '사람과 사회', img: '/assets/images/people.png' },
    { title: '경제', img: '/assets/images/economy.png' },
    { title: '기술', img: '/assets/images/tech.png' },
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
              <HeroLink>알아보기 &gt;</HeroLink>
            </HeroLeft>
            <HeroRight>
              <HeroImage
                src="/assets/images/Global_issue.png"
                alt="Global Issue"
              />
            </HeroRight>
          </HeroInner>
        </HeroSection>

        <Wrapper>
          <Title>글로벌 이슈</Title>
          <Subtitle>관심있는 분야의 이슈를 알아보기!</Subtitle>
          <CategoryList>
            {categories.map((item, index) => (
              <Category key={index}>
                <img src={item.img} alt={item.title} />
                <p>{item.title}</p>
              </Category>
            ))}
          </CategoryList>
        </Wrapper>

        <Wrapper>
          <Header>
            <IssueTitle>최신 이슈</IssueTitle>
            <IssueSubtitle>빠르게 알아보는 글로벌 이슈</IssueSubtitle>
          </Header>
          <MoreLink>더보기 &gt;</MoreLink>
          <IssueGrid>
            {dummyIssues.map((item, idx) => (
              <IssueCard key={idx}>
                <ImageWrapper>
                  <IssueImage
                    src="/assets/images/issue_card_sample.png"
                    alt="이슈 이미지"
                  />
                  <BookmarkIcon
                    src={
                      bookmarked[idx]
                        ? '/assets/images/bookmark_filled.svg'
                        : '/assets/images/bookmark.svg'
                    }
                    alt="북마크"
                    onClick={() => toggleBookmark(idx)}
                  />
                </ImageWrapper>
                <p className="issue-title">{item.title}</p>
                <span className="issue-tag">{item.tag}</span>
              </IssueCard>
            ))}
          </IssueGrid>
        </Wrapper>

        <ChatbotButton onClick={() => alert('챗봇 실행 ~~')}>
          <img src="/assets/images/chatbot.png" alt="챗봇 아이콘" />
        </ChatbotButton>
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
  margin : 0 auto;
  padding: 0;
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
  font-family:NotoSansKR-VariableFont_wght;
`;

const HeroRight = styled.div``;

const HeroTitle = styled.h2`
  font-size: 70px;
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
  margin-bottom: 32px;
`;

const IssueTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
`;

const IssueSubtitle = styled.p`
  font-size: 18px;
  color: #666;
  margin-top: 8px;
`;

const MoreLink = styled.span`
  display: block;
  font-size: 14px;
  cursor: pointer;
  color: #000;
  text-align: right;
  margin-bottom: 16px;
  padding-right: 150px;
`;

const IssueGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const IssueCard = styled.div`
  position: relative;
  width: 405px;
  height: 514px;
  padding: 0;
  border: 2px solid #235BA9;
  background-color: #fff;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;

  .issue-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .issue-tag {
    font-size: 14px;
    color: #555;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const IssueImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const BookmarkIcon = styled.img`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  z-index: 2;
`;

const ChatbotButton = styled.div`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 80px;
  height: 80px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.08);
  }

  img {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }
`;
