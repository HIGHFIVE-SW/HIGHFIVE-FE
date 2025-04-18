import React, { useState } from 'react';
import styled from 'styled-components';

const dummyIssues = [
  { title: '글로벌 “관세 전쟁” 공포… 국내 증시 ‘타격’', tag: '#정치' },
  { title: '글로벌 “관세 전쟁” 공포… 국내 증시 ‘타격’', tag: '#경제' },
  { title: '글로벌 “관세 전쟁” 공포… 국내 증시 ‘타격’', tag: '#사회' },
];

const IssueList = () => {
  const [bookmarked, setBookmarked] = useState(
    new Array(dummyIssues.length).fill(false)
  );

  const toggleBookmark = (idx) => {
    const updated = [...bookmarked];
    updated[idx] = !updated[idx];
    setBookmarked(updated);
  };

  return (
    <Wrapper>
      <Header>
        <Title>최신 이슈</Title>
        <Subtitle>빠르게 알아보는 글로벌 이슈</Subtitle>
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
      <ChatbotButton onClick={() => alert('챗봇 실행 ~~')}>
        <img src="/assets/images/chatbot.png" alt="챗봇 아이콘" />
      </ChatbotButton>
    </Wrapper>
  );
};

export default IssueList;

const Wrapper = styled.section`
  width: 100%;
  max-width: 1600px;
  margin: 80px auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
`;

const Subtitle = styled.p`
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
  padding-right: 100px;
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