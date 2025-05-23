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

const interestItems = [
  { id: 'environment', label: '환경', image: envCard, activeImage: activeEnv },
  { id: 'society', label: '사람과 사회', image: societyCard, activeImage: activeSociety },
  { id: 'economy', label: '경제', image: economyCard, activeImage: activeEconomy },
  { id: 'tech', label: '기술', image: techCard, activeImage: activeTech },
];

export default function InterestSelect({ selected, onSelect }) {
  return (
    <Grid>
      {interestItems.map((item) => (
        <Card
          key={item.id}
          selected={selected === item.id}
          onClick={() => onSelect(item.id)}
        >
          <img
            src={selected === item.id ? item.activeImage : item.image}
            alt={item.label}
            style={{ width: 70, height: 111 }}
          />
          <Label selected={selected === item.id}>{item.label}</Label>
        </Card>
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 32px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: 208px;
  height: 169px;
  background: ${({ selected }) => (selected ? '#F1F6FF' : '#EAEAEA')};
  border-radius: 16px;
  outline: ${({ selected }) => (selected ? '3px solid #235BA9' : 'none')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Label = styled.span`
  margin-top: 10px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ selected }) => (selected ? '#235BA9' : '#333')};
`;
