import React, { useState } from 'react';
import styled from 'styled-components';
import img1 from '../assets/images/onboarding/001.png';
import img2 from '../assets/images/onboarding/002.png';
import img3 from '../assets/images/onboarding/003.png';
import img4 from '../assets/images/onboarding/004.png';
import logo from '../assets/images/common/logo.png';
import trendistTitle from '../assets/images/common/trendist_title.png';
import googleLogo from '../assets/images/onboarding/google_logo.png';
import RobotoFont from '../assets/fonts/Roboto-VariableFont_wdth,wght.ttf';
import ProfileModal from './ProfileModal';

/* font face처럼 작동하게 */
const Roboto = `
  @font-face {
    font-family: 'RobotoCustom';
    src: url(${RobotoFont}) format('truetype');
    font-weight: 100 900;
    font-style: normal;
  }
`;

const GlobalFontStyle = styled.div`
  ${Roboto}
`;

const slides = [
  {
    text: '매일 변화하는 세계, \n당신의 아이디어가 세상을 바꿀 시작입니다.',
    image: img1,
  },
  {
    text: '글로벌 이슈와 함께 다양한 공모전이 \n당신의 도전을 기다리고 있습니다.',
    image: img2
  },
  {
    text: '관심사에 꼭 맞는 추천으로, \n더 특별한 기회를 만나보세요.',
    image: img3,
  },
  {
    text: '지금, 당신의 아이디어를 \n마음껏 펼쳐보세요!',
    image: img4,
  },
];

export default function OnboardingPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleDotClick = (index) => setCurrentPage(index);
  const handleGoogleLoginClick = () => setShowModal(true);

  return (
    <Wrapper>
      <GlobalFontStyle />
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
          <Logo src={logo} alt="logo" />
          <TitleImage src={trendistTitle} alt="Trendist" />
          <GoogleButton onClick={handleGoogleLoginClick}>
            <GoogleIcon src={googleLogo} alt="google_icon" />
            <span>구글로 시작하기</span>
          </GoogleButton>
        </RightSection>
      </Container>
      {showModal && <ProfileModal onClose={() => setShowModal(false)} />}
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
  padding: 20px;
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
  width: 600px;
  margin-bottom: -30px;
`;

const SlideText = styled.p`
  font-family: 'RobotoCustom';
  font-size: 40px;
  text-align: center;
  line-height: 1.8;
  white-space: pre-line;
  max-width: 714px;
  mrgin-top: -10px;
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
  border: 1px solid #235BA9;
  background-color: transparent;
  cursor: pointer;

  &.active {
    background-color: #235BA9;
  }
`;

const Logo = styled.img`
  width: 213px;
`;

const TitleImage = styled.img`
  width: 444px;
  margin-top: -80px;
  margin-bottom: -100px;
`;

const GoogleButton = styled.button`
  width: 500px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -150px;
  gap: 30px;
  padding: 12px 24px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background-color: #fff;
  color: #5f6368;

  font-weight: 600;
  font-size: 22px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;

const GoogleIcon = styled.img`
  width: 40px;
`;
