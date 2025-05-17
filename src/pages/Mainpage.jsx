import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';

import globalIssueImage from '../assets/images/main/ic_GlobalIssue.png';
import issueSampleImage from '../assets/images/main/ic_IssueCardSample.png';
import bookmarkIcon from '../assets/images/main/BookmarkButton.png';
import bookmarkFilledIcon from '../assets/images/main/BookmarkFilledButton.png';
import chatbotIcon from '../assets/images/main/ChatbotButton.png';
import card1 from '../assets/images/main/Card1Button.png';
import card2 from '../assets/images/main/Card2Button.png';
import card3 from '../assets/images/main/Card3Button.png';
import daily from '../assets/images/main/DailyButton.png';
import envCard from '../assets/images/main/EnvironmentButton.png';
import peopleCard from '../assets/images/main/PeopleButton.png';
import economyCard from '../assets/images/main/EconomyButton.png';
import techCard from '../assets/images/main/TechButton.png';
import closeIcon from '../assets/images/main/CloseButton.png';
import activityImage from '../assets/images/main/ic_IssueCardSample.png';
import sendIcon from '../assets/images/main/SendButton.png';


export default function MainPage() {
  const [bookmarked, setBookmarked] = useState(new Array(3).fill(false));
  const [showChatbot, setShowChatbot] = useState(false);
  const messageEndRef = useRef(null);

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

  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCardClick = (option) => {
    const newBotMessage = {
      '글로벌 이슈': '요즘 뜨는 글로벌 이슈는 “관세 전쟁”, “경제 불확실성” 등이 있습니다.',
      '관심사 기반': '당신이 좋아할 만한 활동은 공모전, 서포터즈 등이 있습니다.',
      '분야 기반': '환경, 기술, 사회 분야에 맞춘 활동이 있어요.',
      '일상 대화': '안녕하세요! 좋은 하루 보내고 계신가요?'
    }[option];

    setChatMessages((prev) => [
      ...prev,
      { type: 'user', text: option + ' 추천해줘' },
      { type: 'bot', text: newBotMessage }
    ]);
  };

  const handleUserSubmit = () => {
    if (isSubmitting) return;
    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    setIsSubmitting(true);

    let botResponse;

    if (trimmedInput.includes('나에게 맞는 활동을 추천해줘')) {
      botResponse = (
        <div>
          <p>이런 활동은 어떠세요?<br />관심사에 맞는 활동들을 아래에서 확인해보세요!</p>

          <ActivityBlock>
            <h4>1. 청년 마음돌봄 서포터즈 모집</h4>
            <p><strong>• 활동 내용 :</strong> 국민건강보험공단 서울강원지역본부에서 정신건강에 관심이 많은 대학생을 모집합니다.</p>
            <img src={activityImage} alt="청년 마음돌봄 서포터즈" />
          </ActivityBlock>

          <ActivityBlock>
            <h4>2. HFN의 환자 지원 기부 캠페인</h4>
            <p><strong>• 활동 내용 :</strong> 환자들에게 필요한 지원을 제공하기 위해 기부하는 활동입니다.</p>
            <img src={activityImage} alt="HFN 기부 캠페인" />
          </ActivityBlock>
        </div>
      );
    } else {
      botResponse = '추천활동 4가지를 선택해주세요';
    }

    setChatMessages((prev) => [
      ...prev,
      { type: 'user', text: trimmedInput },
      { type: 'bot', text: botResponse },
    ]);

    setUserInput('');
    setTimeout(() => setIsSubmitting(false), 300);
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [chatMessages]);

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
              <HeroImage src={globalIssueImage} alt="Global Issue" />
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
                  <IssueImage src={issueSampleImage} alt="이슈 이미지" />
                  <BookmarkIcon
                    src={bookmarked[idx] ? bookmarkFilledIcon : bookmarkIcon}
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

        <ChatbotButton onClick={() => setShowChatbot(!showChatbot)}>
          <img src={showChatbot ? closeIcon : chatbotIcon} alt="챗봇 버튼" />
        </ChatbotButton>

        {showChatbot && (
          <ChatbotPanel>
            <ChatHeader>
              <img src={chatbotIcon} alt="챗봇" />
              <h3>챗봇 Trendy</h3>
            </ChatHeader>

            <ChatContentArea ref={messageEndRef}>
              <ChatBubble type="bot">안녕하세요, Trendy 입니다. <p>무엇을 도와드릴까요?</p></ChatBubble>
              <ScrollCardWrapper>
                <ScrollCardRow>
                  <CardItem onClick={() => handleCardClick('글로벌 이슈')}>
                    <img src={card1} alt="글로벌 이슈 추천" />
                    <CardTitle>요즘 뜨는 글로벌 이슈 추천</CardTitle>
                    <CardDesc>“요즘 뜨는 뉴스 알려줘”</CardDesc>
                  </CardItem>
                  <CardItem onClick={() => handleCardClick('관심사 기반')}>
                    <img src={card2} alt="관심사 활동 추천" />
                    <CardTitle>관심사 기반 활동 추천</CardTitle>
                    <CardDesc>“내가 좋아할 만한 활동 알려줘”</CardDesc>
                  </CardItem>
                  <CardItem onClick={() => handleCardClick('분야 기반')}>
                    <img src={card3} alt="분야 활동 추천" />
                    <CardTitle>분야 기반 활동 추천</CardTitle>
                    <CardDesc>“환경 관련 활동 뭐 있을까?”</CardDesc>
                  </CardItem>
                  <CardItem onClick={() => handleCardClick('일상 대화')}>
                    <img src={daily} alt="일상 대화" />
                    <CardTitle>일상 대화</CardTitle>
                    <CardDesc>“안녕! 좋은 아침이야”</CardDesc>
                  </CardItem>
                </ScrollCardRow>
              </ScrollCardWrapper>
              {chatMessages.map((msg, idx) => (
                <ChatBubble key={idx} type={msg.type}>
                  {typeof msg.text === 'string' ? <span>{msg.text}</span> : msg.text}
                </ChatBubble>
              ))}
              <div ref={messageEndRef} />
            </ChatContentArea>

            <ChatInputWrapper>
            <ChatInput
              placeholder="텍스트를 입력하세요."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserSubmit()}
            />
            <SendButton onClick={handleUserSubmit}>
              <img src={sendIcon} alt="전송" />
            </SendButton>
            </ChatInputWrapper>
          </ChatbotPanel>
        )}
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
  margin: 0 auto;
  padding: 0;
`;

const HeroInner = styled.div`
  width: 100%;
  max-width: 1280px;
  height: 530px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeroLeft = styled.div`
  margin-left: -80px;
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
  width: 400px;
  height: 400px;
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
  font-size: 22px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 220px;
    height: 248px;
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
  padding-right: 50px;
`;

const IssueGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 90px;
  flex-wrap: wrap;
  margin-bottom: 150px;
`;

const IssueCard = styled.div`
  width: 405px;
  height: 514px;
  border: 2px solid #235BA9;
  background-color: #fff;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: visible;

  .issue-title {
    font-size: 35px;
    font-weight: bold;
    margin-top: 40px;
    font-family: NotoSansCustom;
  }

  .issue-tag {
    font-size: 30px;
    color: #555;
    margin-top: -20px;
    font-family: NotoSansCustom;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 288px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: visible;
`;

const IssueImage = styled.img`
  width: 399px;
  height: 288px;
  object-fit: cover;
  display: block;
`;

const BookmarkIcon = styled.img`
  position: absolute;
  bottom: -32px;
  right: 12px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 10;
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 10000;

  img {
    width: 90px;
    height: 90px;
    object-fit: contain;
  }
`;

const ChatbotPanel = styled.div`
  position: fixed;
  bottom: 200px;
  right: 32px;
  width: 420px;
  height: 80vh;
  background: #235BA9;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  z-index: 10000;
  display: flex;
  flex-direction: column;

  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F6FAFF;
  padding: 5px;
  gap: 10px;
  font-family: NotoSansCustom;

  img {
    width: 36px;
    height: 36px;
  }
  h3 {
    font-size: 20px;
    font-weight: bold;
  }
`;

const CardItem = styled.div`
  width: 170px;
  height: 180px;
  background: #f5f5f5;
  border-radius: 12px;
  text-align: center;
  padding: 12px 8px;
  box-sizing: border-box;

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-bottom: 6px;
  }
`;

const CardTitle = styled.div`
  font-size: 13px;
  font-weight: bold;
`;

const CardDesc = styled.div`
  font-size: 11px;
  color: #666;
  margin-top: 4px;
`;

const ChatBubble = styled.div`
  align-self: ${({ type }) => (type === 'bot' ? 'flex-start' : 'flex-end')};
  background-color: ${({ type }) => (type === 'bot' ? '#FFFFFF' : '#D9EAFF')};
  padding: 10px 18px;
  border-radius: 20px;
  margin: 6px 0;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  max-width: 80%;
  box-shadow: ${({ type }) =>
    type === 'user' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  border: ${({ type }) => (type === 'user' ? '2px solid #D9EAFF' : 'none')};

  img {
    margin-top: 10px;
    width: 180px;
    height: auto;
    border-radius: 8px;
  }

  h4 {
    margin: 12px 0 6px;
    font-weight: bold;
  }

  p {
    margin: 4px 0;
  }
`;

const ChatInputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
  background-color: white;
  border-radius: 20px;
  margin: 16px;
`;

const ChatInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 12px;
`;

const SendButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;

const ActivityBlock = styled.div`
  margin-top: 20px;
  font-family: 'NotoSansCustom';

  h4 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    line-height: 1.6;
    margin: 6px 0;
  }

  img {
    margin-top: 12px;
    width: 132px;
    height: 142px;
    border: 3px solid #235BA9;
    border-radius: 0;
    display: block;
  }
`;
const ChatContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const ScrollCardWrapper = styled.div`
  overflow-x: auto;
  padding-bottom: 16px;
  flex-shrink: 0;
`;

const ScrollCardRow = styled.div`
  display: flex;
  gap: 12px;
  width: max-content;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;
