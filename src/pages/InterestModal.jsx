import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


import envCard from '../assets/images/interests/environment_card.png';
import societyCard from '../assets/images/interests/society_card.png';
import economyCard from '../assets/images/interests/economy_card.png';
import techCard from '../assets/images/interests/tech_card.png';
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
      image: envCard,
      activeImage: require('../assets/images/interests/environment_card_active.png'),
    },
    {
      id: 'society',
      image: societyCard,
      activeImage: require('../assets/images/interests/society_card_active.png'),
    },
    {
      id: 'economy',
      image: economyCard,
      activeImage: require('../assets/images/interests/economy_card_active.png'),
    },
    {
      id: 'tech',
      image: techCard,
      activeImage: require('../assets/images/interests/tech_card_active.png'),
    },
  ];
  

export default function InterestModal({ onClose }) {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (id) => setSelected(id);

  const handleComplete = () => {
    if (selected) {
      console.log('Selected Interest:', selected);
      onClose();
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
                <CardImage
                    src={selected === item.id ? item.activeImage : item.image}
                    alt={item.id}/>
              </InterestCard>
            ))}
          </Grid>
        </ContentWrapper>
        <NextButton onClick={handleComplete}>완료</NextButton>
      </ModalBox>
    </ModalOverlay>
    </>
  );
}

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
  gap: 0px;
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
  background-color: ${({ selected }) => (selected ? '#F1F6FF' : '#F6FAFF')};
  border-radius: 16px;
  padding: 0;
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

const CardImage = styled.img`
  width: 70px;
  height: 111px;
  object-fit: contain;
`;

const NextButton = styled.button`
  width: 189px;
  height: 64px;
  padding: 12px;
  font-size: 20px;
  font-family: 'NotoSansCustom'; 
  font-weight: 600;
  background-color: #235BA9;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-bottom: 8px;
`;