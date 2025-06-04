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

export default function Chatbot() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messageEndRef = useRef(null);

  const handleCardClick = (option) => {
    const newBotMessage = {
      '글로벌 이슈': '요즘 뜨는 글로벌 이슈는 “관세 전쟁”, “경제 불확실성” 등이 있습니다.',
      '관심사 기반': '당신이 좋아할 만한 활동은 공모전, 서포터즈 등이 있습니다.',
      '분야 기반': '환경, 기술, 사회 분야에 맞춘 활동이 있어요.',
      '일상 대화': '안녕하세요! 좋은 하루 보내고 계신가요?',
    }[option];

    setChatMessages((prev) => [
      ...prev,
      { type: 'user', text: `${option} 추천해줘` },
      { type: 'bot', text: newBotMessage },
    ]);
  };

  const handleUserSubmit = () => {
    if (isSubmitting) return;
    const trimmed = userInput.trim();
    if (!trimmed) return;

    setIsSubmitting(true);

    let botResponse;

    if (trimmed.includes('나에게 맞는 활동을 추천해줘')) {
      botResponse = (
        <div>
          <p>이런 활동은 어떠세요?<br />관심사에 맞는 활동들을 아래에서 확인해보세요!</p>
          <ActivityBlock>
            <h4>1. 청년 마음돌봄 서포터즈 모집</h4>
            <p><strong>• 활동 내용 :</strong> 국민건강보험공단에서 정신건강에 관심 많은 대학생 모집</p>
            <img src={activityImage} alt="서포터즈" />
          </ActivityBlock>
          <ActivityBlock>
            <h4>2. HFN 환자 지원 기부 캠페인</h4>
            <p><strong>• 활동 내용 :</strong> 환자들에게 필요한 지원을 위한 기부 활동</p>
            <img src={activityImage} alt="기부 캠페인" />
          </ActivityBlock>
        </div>
      );
    } else {
      botResponse = '추천활동 4가지를 선택해주세요';
    }

    setChatMessages((prev) => [
      ...prev,
      { type: 'user', text: trimmed },
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
    <>
      <ChatbotButton onClick={() => setShowChatbot((prev) => !prev)}>
        <img
          src={showChatbot ? closeIcon : chatbotIcon}
          alt="챗봇 버튼"
          className={showChatbot ? 'close-icon' : 'chatbot-icon'}
        />
      </ChatbotButton>

      {showChatbot && (
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
                <CardItem onClick={() => handleCardClick('글로벌 이슈')}>
                  <img src={card1} alt="글로벌 이슈 추천" />
                  <CardTitle>요즘 뜨는 글로벌 이슈 추천</CardTitle>
                  <CardDesc>“태풍관련 뉴스 알려줘”</CardDesc>
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

            {chatMessages.map((msg, i) => (
              <ChatBubble key={i} type={msg.type}>
                {typeof msg.text === 'string' ? msg.text : msg.text}
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
    </>
  );
}

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

const ChatBubble = styled.div`
    align-self: ${({ type }) => (type === 'bot' ? 'flex-start' : 'flex-end')};
    background-color: ${({ type }) => (type === 'bot' ? '#FFFFFF' : '#D9EAFF')};
    padding: 10px 18px;
    border-radius: 20px;
    margin: 6px 0;
    font-size: 14px;
    font-weight: 500;
    color: #000;
    display: inline-block;         /* 텍스트 크기에 맞는 블록 */
    width: fit-content;            /* 내용에 맞춰 폭 조절 */
    max-width: 80%;                /* 너무 길면 최대 80% 까지만 */
    box-shadow: ${({ type }) =>
      type === 'user' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none'};
    border: ${({ type }) => (type === 'user' ? '2px solid #D9EAFF' : 'none')};
    word-break: keep-all;
  white-space: pre-wrap;

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
