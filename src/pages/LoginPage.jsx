import React, { useState } from 'react';
import styled from 'styled-components';

const slides = [
  {
    text: '매일 변화하는 세계, 당신의 아이디어가 세상을 바꿀 시작입니다.',
    image: '/assets/images/onboarding/001.png',
  },
  {
    text: '글로벌 이슈와 함께 다양한 공모전이 당신의 도전을 기다리고 있습니다.',
    image: '/assets/images/onboarding/002.png',
  },
  {
    text: '관심사에 꼭 맞는 추천으로, 더 특별한 기회를 만나보세요.',
    image: '/assets/images/onboarding/003.png',
  },
  {
    text: '지금, 당신의 아이디어를 마음껏 펼쳐보세요!',
    image: '/images/onboarding/004.png',
  },
];

export default function OnboardingPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const handleDotClick = (index) => setCurrentPage(index);

  return (
    <Wrapper>
      <Container>
        <LeftSection>
          <SlideImage src={slides[currentPage].image} alt="slide" />
          <SlideText>{slides[currentPage].text}</SlideText>
          <DotContainer>
            {slides.map((_, i) => (
              <Dot
                key={i}
                className={currentPage === i ? 'active' : ''}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </DotContainer>
        </LeftSection>

        <RightSection>
          <Logo src="/assets/images/common/logo.png" alt="logo" />
          <TitleImage src="/assets/images/common/trendist_title.png" alt="Trendist" />
          <GoogleButton>
            <GoogleIcon src="/assets/images/common/google_logo.png" alt="google_icon" />
            <span>구글로 시작하기</span>
          </GoogleButton>
        </RightSection>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px; // 이건 내 맥북..
  box-sizing: border-box;
`;

const Container = styled.div`
  width: 1600px;
  height: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SlideImage = styled.img`
  width: 200px;
  margin-bottom: 20px;
`;

const SlideText = styled.p`
  font-size: 18px;
  text-align: center;
  line-height: 1.8;
  white-space: pre-line;
`;

const DotContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #2452d0;
  background-color: transparent;
  cursor: pointer;

  &.active {
    background-color: #2452d0;
  }
`;

const Logo = styled.img`
  width: 213px;
`;

const TitleImage = styled.img`
  width: 444px;
  margin-top: -150px;
  margin-bottom: -100px;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  font-weight: bold;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;

const GoogleIcon = styled.img`
  width: 20px;
`;
