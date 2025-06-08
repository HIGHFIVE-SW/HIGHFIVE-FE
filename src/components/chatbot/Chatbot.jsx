import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import chatbotIcon from '../../assets/images/main/ChatbotButton.png';
import closeIcon from '../../assets/images/main/CloseButton.png';
import sendIcon from '../../assets/images/main/SendButton.png';
import card1 from '../../assets/images/main/Card1Button.png';
import card2 from '../../assets/images/main/Card2Button.png';
import card3 from '../../assets/images/main/Card3Button.png';
import daily from '../../assets/images/main/DailyButton.png';
import activityImage from '../../assets/images/issue/ic_IssueCardSample.png';
import { askChatbot, resetChatbot, askChatbotHistoryRecommendation, resetChatbotHistoryRecommendation, askChatbotKeywordRecommendation, resetChatbotKeywordRecommendation, askChatbotOthers, resetChatbotOthers } from '../../api/ChatBotApi';

// 링크를 감지하고 클릭 가능하게 만드는 컴포넌트
const LinkifiedText = ({ text }) => {
  if (typeof text !== 'string') {
    return text;
  }

  // ** 제거 (Source 옆의 ** 등)
  let processedText = text.replace(/\*\*/g, '');

  // 마크다운 링크 형식 [텍스트](URL) 처리
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  processedText = processedText.replace(markdownLinkRegex, (match, linkText, url) => {
    return `__MARKDOWN_LINK__${linkText}__SEPARATOR__${url}__END_LINK__`;
  });

  // 일반 URL 패턴
  const urlRegex = /(https?:\/\/[^\s<>"\[\]]+)/g;
  
  // 먼저 마크다운 링크를 분리
  const parts = processedText.split(/(__MARKDOWN_LINK__.*?__END_LINK__)/);
  
  return parts.map((part, index) => {
    // 마크다운 링크 처리
    if (part.startsWith('__MARKDOWN_LINK__')) {
      const [, linkText, url] = part.match(/__MARKDOWN_LINK__(.*?)__SEPARATOR__(.*?)__END_LINK__/);
      return (
        <ChatLink 
          key={index} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {linkText}
        </ChatLink>
      );
    }
    
    // Source 굵게 처리 (간단한 방법)
    const sourceRegex = /(Source\s*:?|출처\s*:?)/gi;
    if (sourceRegex.test(part)) {
      const sourceParts = part.split(/(Source\s*:?|출처\s*:?)/gi);
      return sourceParts.map((sourcePart, sourceIndex) => {
        if (/(Source\s*:?|출처\s*:?)/gi.test(sourcePart)) {
          return (
            <BoldText key={`${index}-source-${sourceIndex}`}>
              {sourcePart}
            </BoldText>
          );
        }
        
        // 일반 URL 처리
        const urlParts = sourcePart.split(urlRegex);
        return urlParts.map((urlPart, urlIndex) => {
          if (urlRegex.test(urlPart)) {
            return (
              <ChatLink 
                key={`${index}-${sourceIndex}-${urlIndex}`} 
                href={urlPart} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {urlPart}
              </ChatLink>
            );
          }
          return urlPart;
        });
      });
    }
    
    // 일반 URL 처리
    const urlParts = part.split(urlRegex);
    return urlParts.map((urlPart, urlIndex) => {
      if (urlRegex.test(urlPart)) {
        return (
          <ChatLink 
            key={`${index}-${urlIndex}`} 
            href={urlPart} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {urlPart}
          </ChatLink>
        );
      }
      return urlPart;
    });
  });
};

export default function Chatbot() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApiMode, setSelectedApiMode] = useState(null); // 선택된 API 모드
  const messageEndRef = useRef(null);

  // 사용자 ID 가져오기 (localStorage에서 또는 테스트용 UUID 사용)
  const getUserId = () => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      return storedUserId;
    }
    // 테스트용 UUID 반환
    return '418ac62d-1fb8-4957-adb9-4b1779ef2504';
  };

  const handleCardClick = async (option) => {
    // API 모드 선택
    setSelectedApiMode(option);
    
    const modeMessages = {
      '글로벌 이슈': '웹 검색 기반 글로벌 이슈 추천 모드가 선택되었습니다. 궁금한 이슈나 뉴스를 물어보세요!',
      '관심사 기반': '관심사 기반 활동 추천 모드가 선택되었습니다. 어떤 활동을 찾고 계신가요?',
      '분야 기반': '분야 기반 활동 추천 모드가 선택되었습니다. 관심 분야를 알려주세요!',
      '일상 대화': '일상 대화 모드가 선택되었습니다. 편하게 대화해보세요!',
    };
    
    // 모드 선택 메시지 추가
    setChatMessages((prev) => [
      ...prev,
      { type: 'bot', text: modeMessages[option] },
    ]);

    // 선택된 모드에 따라 해당 챗봇 초기화
    try {
      if (option === '글로벌 이슈') {
        await resetChatbot(getUserId());
      } else if (option === '관심사 기반') {
        await resetChatbotHistoryRecommendation(getUserId());
      } else if (option === '분야 기반') {
        await resetChatbotKeywordRecommendation(getUserId());
      } else if (option === '일상 대화') {
        await resetChatbotOthers(getUserId());
      } else {
        // 기본값은 웹 검색 챗봇으로 초기화
        await resetChatbot(getUserId());
      }
    } catch (error) {
      console.error('챗봇 모드 초기화 실패:', error);
    }
  };

  const handleUserSubmit = async () => {
    if (isSubmitting || isLoading) return;
    const trimmed = userInput.trim();
    if (!trimmed) return;

    // API 모드가 선택되지 않은 경우 선택 요청
    if (!selectedApiMode) {
      setChatMessages((prev) => [
        ...prev,
        { type: 'user', text: trimmed },
        { type: 'bot', text: '먼저 위의 카드 중 하나를 선택해주세요! 선택하신 모드에 따라 적절한 답변을 드리겠습니다.' },
      ]);
      setUserInput('');
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    // 사용자 메시지 추가
    setChatMessages((prev) => [
      ...prev,
      { type: 'user', text: trimmed },
    ]);

    setUserInput('');

    try {
      let botResponse;
      const userId = getUserId();
      console.log('사용자 ID:', userId, '모드:', selectedApiMode);
      
      if (selectedApiMode === '글로벌 이슈') {
        // 웹 검색 기반 질문 응답 API 사용
        botResponse = await askChatbot(userId, trimmed);
      } else if (selectedApiMode === '관심사 기반') {
        // 관심사 기반 활동 추천 API 사용
        botResponse = await askChatbotHistoryRecommendation(userId, trimmed);
      } else if (selectedApiMode === '분야 기반') {
        // 분야 기반(키워드) 활동 추천 API 사용
        botResponse = await askChatbotKeywordRecommendation(userId, trimmed);
      } else if (selectedApiMode === '일상 대화') {
        // 일상 대화(기타 질문) API 사용
        botResponse = await askChatbotOthers(userId, trimmed);
      } else {
        // 기본값은 웹 검색 API 사용
        botResponse = await askChatbot(userId, trimmed);
      }
      
      setChatMessages((prev) => [
        ...prev,
        { type: 'bot', text: botResponse },
      ]);
    } catch (error) {
      console.error('챗봇 API 호출 실패:', error);
      setChatMessages((prev) => [
        ...prev,
        { type: 'bot', text: '죄송합니다. 현재 서비스에 문제가 있어 응답할 수 없습니다. 잠시 후 다시 시도해주세요.' },
      ]);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 챗봇 열림/닫힘에 따라 배경 스크롤 제어
  useEffect(() => {
    if (showChatbot) {
      // 챗봇이 열릴 때 배경 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 챗봇이 닫힐 때 배경 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showChatbot]);

  return (
    <>
      <ChatbotButton onClick={() => {
        setShowChatbot((prev) => {
          if (!prev) {
            // 챗봇을 열 때 대화 및 모드 초기화
            setChatMessages([]);
            setSelectedApiMode(null);
            // 웹 검색 기반 챗봇으로 초기화 (기본값)
            resetChatbot(getUserId()).catch(console.error);
          }
          return !prev;
        });
      }}>
        <img
          src={showChatbot ? closeIcon : chatbotIcon}
          alt="챗봇 버튼"
          className={showChatbot ? 'close-icon' : 'chatbot-icon'}
        />
      </ChatbotButton>

      {showChatbot && (
        <>
          <ChatbotOverlay onClick={() => setShowChatbot(false)} />
          <ChatbotPanel>
          <ChatHeader>
            <img src={chatbotIcon} alt="챗봇" />
            <h3>챗봇 Trendy</h3>
          </ChatHeader>

          <ChatContentArea ref={messageEndRef}>
            <ChatBubble type="bot">
              안녕하세요, Trendy 입니다. {'\n'} 무엇을 도와드릴까요?
            </ChatBubble>

            <ScrollCardWrapper>
              <ScrollCardRow>
                <CardItem 
                  onClick={() => handleCardClick('글로벌 이슈')}
                  selected={selectedApiMode === '글로벌 이슈'}
                >
                  <img src={card1} alt="글로벌 이슈 추천" />
                  <CardTitle>웹 검색 기반 글로벌 이슈</CardTitle>
                  <CardDesc>"태풍관련 뉴스 알려줘"</CardDesc>
                </CardItem>
                <CardItem 
                  onClick={() => handleCardClick('관심사 기반')}
                  selected={selectedApiMode === '관심사 기반'}
                >
                  <img src={card2} alt="관심사 활동 추천" />
                  <CardTitle>관심사 기반 활동 추천</CardTitle>
                  <CardDesc>"내가 좋아할 만한 활동 알려줘"</CardDesc>
                </CardItem>
                <CardItem 
                  onClick={() => handleCardClick('분야 기반')}
                  selected={selectedApiMode === '분야 기반'}
                >
                  <img src={card3} alt="분야 활동 추천" />
                  <CardTitle>분야 기반 활동 추천</CardTitle>
                  <CardDesc>"환경 관련 활동 뭐 있을까?"</CardDesc>
                </CardItem>
                <CardItem 
                  onClick={() => handleCardClick('일상 대화')}
                  selected={selectedApiMode === '일상 대화'}
                >
                  <img src={daily} alt="일상 대화" />
                  <CardTitle>일상 대화</CardTitle>
                  <CardDesc>"안녕! 좋은 아침이야"</CardDesc>
                </CardItem>
              </ScrollCardRow>
            </ScrollCardWrapper>

            {chatMessages.map((msg, i) => (
              <ChatBubble key={i} type={msg.type}>
                <LinkifiedText text={msg.text} />
              </ChatBubble>
            ))}
            
            {isLoading && (
              <ChatBubble type="bot">
                {selectedApiMode === '관심사 기반' 
                  ? '개인화된 활동을 추천하고 있습니다...'
                  : selectedApiMode === '분야 기반'
                  ? '해당 분야의 활동을 찾고 있습니다...'
                  : '답변을 생성하고 있습니다...'
                }
              </ChatBubble>
            )}
            
            <div ref={messageEndRef} />
          </ChatContentArea>

          <ChatInputWrapper>
            <ChatInput
              placeholder={
                isLoading 
                  ? "답변을 기다리는 중..." 
                  : selectedApiMode 
                    ? `${selectedApiMode} 관련 질문을 입력하세요.`
                    : "위의 카드 중 하나를 선택 후 질문해주세요."
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleUserSubmit()}
              disabled={isLoading}
            />
            <SendButton onClick={handleUserSubmit} disabled={isLoading}>
              <img src={sendIcon} alt="전송" />
            </SendButton>
          </ChatInputWrapper>
        </ChatbotPanel>
        </>
      )}
    </>
  );
}

const ChatbotOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 100px;
  height: 100px;
  background-color: #F9FBFF;
  border-radius: 50%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;

  img.chatbot-icon {
    width: 90px;
    height: 90px;
  }

  img.close-icon {
    width: 60px;
    height: 60px;
  }
`;

const ChatbotPanel = styled.div`
  position: fixed;
  bottom: 160px;
  right: 32px;
  width: 400px;
  height: 75vh;
  background: #235BA9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F6FAFF;
  padding: 5px;
  gap: 10px;
  border-radius: 16px 16px 0 0;

  img {
    width: 36px;
    height: 36px;
  }

  h3 {
    font-size: 20px;
    font-weight: bold;
  }
`;

const ChatContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 16px;
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
  padding: 6px;
  background-color: ${({ disabled }) => (disabled ? '#f5f5f5' : 'white')};
  color: ${({ disabled }) => (disabled ? '#999' : '#000')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};
`;

const SendButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  img {
    width: 24px;
    height: 24px;
  }
`;

const ChatBubble = styled.div`
    align-self: ${({ type }) => (type === 'bot' ? 'flex-start' : 'flex-end')};
    background-color: ${({ type }) => (type === 'bot' ? '#FFFFFF' : '#D9EAFF')};
    padding: 10px 18px;
    border-radius: 20px;
    margin: 6px 0;
    font-size: 14px;
    font-weight: 500;
    color: #000;
    display: block;                
    width: ${({ type }) => (type === 'bot' ? '100%' : 'fit-content')}; /* 봇은 전체, 사용자는 내용에 맞춤 */
    max-width: 95%;                
    box-sizing: border-box;        
    box-shadow: ${({ type }) =>
      type === 'user' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none'};
    border: ${({ type }) => (type === 'user' ? '2px solid #D9EAFF' : 'none')};
    word-break: break-word;        
    white-space: pre-wrap;         
    overflow-wrap: break-word;     
    line-height: 1.4;             

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

const CardItem = styled.div`
  width: 150px;
  height: 160px;
  background: ${({ selected }) => (selected ? '#e6f3ff' : '#f5f5f5')};
  border: ${({ selected }) => (selected ? '2px solid #235BA9' : '2px solid transparent')};
  border-radius: 12px;
  text-align: center;
  padding: 12px 8px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${({ selected }) => (selected ? '#d6ebff' : '#e8e8e8')};
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-bottom: 6px;
  }
`;

const CardTitle = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const CardDesc = styled.div`
  font-size: 10px;
  color: #666;
  margin-top: 4px;
  `;

const ActivityBlock = styled.div`
  margin-top: 20px;

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

const SelectedBadge = styled.div`
  background-color: #235BA9;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin-top: 4px;
`;

const ChatLink = styled.a`
  color: #235BA9;
  text-decoration: underline;
  cursor: pointer;
  word-break: break-all;
  
  &:hover {
    color: #1a4480;
    text-decoration: none;
  }
  
  &:visited {
    color: #6b46c1;
  }
`;

const BoldText = styled.strong`
  font-weight: 700;
  color: #000;
  font-size: inherit;
`;
