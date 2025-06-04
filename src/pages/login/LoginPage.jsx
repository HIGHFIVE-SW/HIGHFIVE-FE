import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

import img1 from '../../assets/images/login/onboarding/001.png';
import img2 from '../../assets/images/login/onboarding/002.png';
import img3 from '../../assets/images/login/onboarding/003.png';
import img4 from '../../assets/images/login/onboarding/004.png';
import logo from '../../assets/images/common/ImageLogo.png';
import trendistTitle from '../../assets/images/common/TextLogo.png';
import googleLogo from '../../assets/images/login/ic_Google.png';
import RobotoFont from '../../assets/fonts/Roboto-VariableFont_wdth,wght.ttf';
import ProfileModal from './ProfileModal';

/* font face 정의 */
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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserProfile = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) return;

      try {
        // 토큰 저장 (axiosInstance 인터셉터가 자동으로 헤더에 추가)
        localStorage.setItem('token', token);

        // 프로필 조회
        const { data } = await axiosInstance.get('/users/profile');
        const { result } = data;
        
        // 프로필 미완료 시 모달 표시
        if (!result || !result.nickname || !result.keyword) {
          setShowModal(true);
        } else {
          navigate('/main');
        }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        // 에러가 발생해도 프로필 모달을 표시
        setShowModal(true);
      }
    };

    checkUserProfile();
  }, [location.search, navigate]);

  const handleDotClick = (index) => setCurrentPage(index);

  // 구글 로그인 연동
  const handleGoogleLoginClick = () => {
    window.location.href = "http://61.109.236.137:8080/oauth2/authorization/google";
  };

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
          <RightGroup>
            <Logo src={logo} alt="logo" />
            <TitleImage src={trendistTitle} alt="Trendist" />
            <GoogleButton onClick={handleGoogleLoginClick}>
              <GoogleIcon src={googleLogo} alt="google_icon" />
              <span>구글로 시작하기</span>
            </GoogleButton>
          </RightGroup>
        </RightSection>
      </Container>
      {showModal && <ProfileModal onClose={() => setShowModal(false)} />}
    </Wrapper>
  );
}

// 스타일 컴포넌트들은 기존 코드와 동일
const Wrapper = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightSection = styled.div`
  flex: 1;
  position: relative;
`;

const RightGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -65%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SlideImage = styled.img`
  width: 600px;
  margin-bottom: -30px;
`;

const SlideText = styled.p`
  font-family: 'RobotoCustom';
  font-size: 35px;
  text-align: center;
  line-height: 1.8;
  white-space: pre-line;
  max-width: 714px;
  margin-top: -10px;
`;

const DotContainer = styled.div`
  display: flex;
  gap: 45px;
  margin-top: 20px;
`;

const Dot = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #235BA9;
  background-color: transparent;
  cursor: pointer;

  &.active {
    background-color: #235BA9;
  }
`;

const Logo = styled.img`
  width: 200px;
`;

const TitleImage = styled.img`
  width: 430px;
  margin-top: -170px;
  margin-bottom: -70px;
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
  border: 1px solid #fff;
  border-radius: 16px;
  background-color: #fff;
  color: #6F6F6F;
  font-weight: 400;
  font-size: 30px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;

const GoogleIcon = styled.img`
  width: 40px;
`;
