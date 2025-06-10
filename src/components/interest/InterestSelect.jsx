import React from 'react';
import styled from 'styled-components';
import envCard from '../../assets/images/interestmodal/ic_EnvironmentInterest.png';
import societyCard from '../../assets/images/interestmodal/ic_SocietyInterest.png';
import economyCard from '../../assets/images/interestmodal/ic_EconomyInterest.png';
import techCard from '../../assets/images/interestmodal/ic_TechInterest.png';
import activeEnv from '../../assets/images/interestmodal/ic_EnvironmentInterest_active.png';
import activeSociety from '../../assets/images/interestmodal/ic_SocietyInterest_active.png';
import activeEconomy from '../../assets/images/interestmodal/ic_EconomyInterest_active.png';
import activeTech from '../../assets/images/interestmodal/ic_TechInterest_active.png';

// API 키워드와 UI ID 매핑
const KEYWORD_TO_ID_MAP = {
  'Environment': 'environment',
  'PeopleAndSociety': 'society', 
  'Economy': 'economy',
  'Technology': 'tech',
  // 한국어도 지원
  '환경': 'environment',
  '사람과 사회': 'society',
  '경제': 'economy', 
  '기술': 'tech'
};

const ID_TO_KEYWORD_MAP = {
  'environment': 'Environment',
  'society': 'PeopleAndSociety',
  'economy': 'Economy',
  'tech': 'Technology'
};

const interestItems = [
  { id: 'environment', label: '환경', image: envCard, activeImage: activeEnv },
  { id: 'society', label: '사람과 사회', image: societyCard, activeImage: activeSociety },
  { id: 'economy', label: '경제', image: economyCard, activeImage: activeEconomy },
  { id: 'tech', label: '기술', image: techCard, activeImage: activeTech },
];

export default function InterestSelect({ selected, onSelect }) {
  // API 키워드를 UI ID로 변환
  const selectedId = KEYWORD_TO_ID_MAP[selected] || selected;
  
  const handleSelect = (id) => {
    // UI ID를 API 키워드로 변환하여 전달
    const keyword = ID_TO_KEYWORD_MAP[id] || id;
    onSelect(keyword);
  };

  return (
    <Grid>
      {interestItems.map((item) => (
        <InterestCard
          key={item.id}
          selected={selectedId === item.id}
          onClick={() => handleSelect(item.id)}
        >
          <CardInner>
            <CardImage
              src={selectedId === item.id ? item.activeImage : item.image}
              alt={item.label}
            />
            <LabelText selected={selectedId === item.id}>{item.label}</LabelText>
          </CardInner>
        </InterestCard>
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 208px);
  gap: 40px;
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
  color: ${({ selected }) => (selected ? '#235BA9' : '#333')};
`;
