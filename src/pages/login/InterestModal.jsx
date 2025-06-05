// InterestModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { setUserProfile } from '../../api/userApi'; // 경로는 프로젝트 구조에 맞게 조정

import envCard from '../../assets/images/interestmodal/ic_EnvironmentInterest.png';
import societyCard from '../../assets/images/interestmodal/ic_SocietyInterest.png';
import economyCard from '../../assets/images/interestmodal/ic_EconomyInterest.png';
import techCard from '../../assets/images/interestmodal/ic_TechInterest.png';
import envCardActive from '../../assets/images/interestmodal/ic_EnvironmentInterest_active.png';
import societyCardActive from '../../assets/images/interestmodal/ic_SocietyInterest_active.png';
import economyCardActive from '../../assets/images/interestmodal/ic_EconomyInterest_active.png';
import techCardActive from '../../assets/images/interestmodal/ic_TechInterest_active.png';
import NotoSansKR from '../../assets/fonts/NotoSansKR-VariableFont_wght.ttf';

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
  { id: 'environment', label: '환경', apiValue: 'Environment', image: envCard, activeImage: envCardActive },
  { id: 'society', label: '사람과 사회', apiValue: 'PeopleAndSociety', image: societyCard, activeImage: societyCardActive },
  { id: 'economy', label: '경제', apiValue: 'Economy', image: economyCard, activeImage: economyCardActive },
  { id: 'tech', label: '기술', apiValue: 'Technology', image: techCard, activeImage: techCardActive },
];

export default function InterestModal({ onClose, nickname, profileUrl }) {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (id) => setSelected(id);

  const handleComplete = async () => {
    if (selected) {
      const selectedInterest = interests.find(i => i.id === selected);
      try {
        // 항상 3개 필드 포함!
        const userData = {
          nickname: nickname,
          keyword: selectedInterest.apiValue,
          profileUrl:
            profileUrl !== '/static/media/DefaultProfile.c57a8fc43667160da616.png'
              ? profileUrl
              : "기본값"
        };

        console.log('전송할 데이터:', userData);

        const response = await setUserProfile(userData);

        if (response?.isSuccess) {
          navigate('/main');
        } else {
          console.error('프로필 저장 실패:', response);
          alert(response?.message || '회원정보 저장에 실패했습니다.');
        }
      } catch (e) {
        console.error('프로필 저장 실패:', e.response?.data || e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else if (e.message === 'Network Error') {
          alert('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      }
    } else {
      alert('관심 분야를 선택해주세요.');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <GlobalFontStyle />
        <HeaderWrapper>
          <Title>관심 분야를 선택해주세요.</Title>
          <Subtitle>*한 가지만 선택해주세요</Subtitle>
        </HeaderWrapper>
        <Grid>
          {interests.map((item) => (
            <InterestCard
              key={item.id}
              selected={selected === item.id}
              onClick={() => handleSelect(item.id)}
            >
              <CardInner>
                <CardImage src={selected === item.id ? item.activeImage : item.image} />
                <LabelText selected={selected === item.id}>{item.label}</LabelText>
              </CardInner>
            </InterestCard>
          ))}
        </Grid>
        <NextButton disabled={!selected} onClick={handleComplete}>
          완료
        </NextButton>
      </ModalBox>
    </ModalOverlay>
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