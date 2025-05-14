import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import envCard from '../assets/images/interestmodal/ic_EnvironmentInterest.png';
import societyCard from '../assets/images/interestmodal/ic_SocietyInterest.png';
import economyCard from '../assets/images/interestmodal/ic_EconomyInterest.png';
import techCard from '../assets/images/interestmodal/ic_TechInterest.png';
import NotoSansKR from '../assets/fonts/NotoSansKR-VariableFont_wght.ttf';

const NotoSansFont = `
  @font-face {
    font-family: 'NotoSansCustom';
    src: url(${NotoSansKR}) format('truetype');
    font-weight: 100 900;
    font-style: normal;
  }
`;

const GlobalFontStyle = styled.div`
  ${NotoSansFont}
`;

const interests = [
  {
    id: 'environment',
    label: '환경',
    image: envCard,
    activeImage: require('../assets/images/interestmodal/ic_EnvironmentInterest_active.png'),
  },
  {
    id: 'society',
    label: '사회',
    image: societyCard,
    activeImage: require('../assets/images/interestmodal/ic_SocietyInterest_active.png'),
  },
  {
    id: 'economy',
    label: '경제',
    image: economyCard,
    activeImage: require('../assets/images/interestmodal/ic_EconomyInterest_active.png'),
  },
  {
    id: 'tech',
    label: '기술',
    image: techCard,
    activeImage: require('../assets/images/interestmodal/ic_TechInterest_active.png'),
  },
];

export default function InterestModal({ onClose }) {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate(); // 라우터 네비게이터 훅

  const handleSelect = (id) => setSelected(id);

  const handleComplete = () => {
    if (selected) {
      navigate('/main');
    } else {
      alert('관심 분야를 선택해주세요.');
    }
  };

  return (
    <>
      <GlobalFontStyle />
      <ModalOverlay>
        <ModalBox>
          <ContentWrapper>
            <HeaderWrapper>
              <Title>관심 분야를 선택해주세요.</Title>
              <Subtitle>*한 가지만 선택해주세요</Subtitle>
            </HeaderWrapper>
            <Grid>
              {interests.map((item) => (
                <InterestCard
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  selected={selected === item.id}
                >
                  <CardInner>
                    <CardImage
                      src={selected === item.id ? item.activeImage : item.image}
                      alt={item.id}
                    />
                    <LabelText selected={selected === item.id}>{item.label}</LabelText>
                  </CardInner>
                </InterestCard>
              ))}
            </Grid>
          </ContentWrapper>
          <NextButton onClick={handleComplete} disabled={!selected}>
            완료
          </NextButton>
        </ModalBox>
      </ModalOverlay>
    </>
  );
}

// 스타일드 컴포넌트 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: white;
  font-family: 'NotoSansCustom';
  border-radius: 16px;
  padding: 40px;
  width: 808px;
  height: 609px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
`;

const Title = styled.h2`
  font-size: 35px;
  font-family: 'NotoSansCustom';
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #FF0000;
  font-size: 20px;
  font-family: 'NotoSansCustom';
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 208px);
  grid-template-rows: repeat(2, 169px);
  gap: 40px 50px;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

const InterestCard = styled.div`
  background-color: ${({ selected }) => (selected ? '#F1F6FF' : '#EAEAEA')};
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s;
  outline: ${({ selected }) => (selected ? '3px solid #235BA9' : 'none')};
  width: 208px;
  height: 169px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.02);
  }
`;

const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardImage = styled.img`
  width: 70px;
  height: 111px;
  object-fit: contain;
`;

const LabelText = styled.span`
  margin-bottom: 10px;
  font-weight: 460;
  font-size: 20px;
  font-family: 'NotoSansCustom';
  color: ${({ selected }) => (selected ? '#235BA9' : '#333')};
`;

const NextButton = styled.button.attrs(props => ({
  disabled: props.disabled,
}))`
  width: 189px;
  height: 64px;
  padding: 12px;
  font-size: 20px;
  font-family: 'NotoSansCustom';
  font-weight: 600;
  background-color: ${({ disabled }) => (disabled ? '#C4C4C4' : '#235BA9')};
  color: white;
  border: none;
  border-radius: 30px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
`;
