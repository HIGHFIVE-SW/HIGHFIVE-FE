import React from 'react';
import styled from 'styled-components';

import beginnerIcon from '../../assets/images/level/ic_Beginner.png';
import proIcon from '../../assets/images/level/ic_Pro.png';
import masterIcon from '../../assets/images/level/ic_Master.png';
import leaderIcon from '../../assets/images/level/ic_Leader.png';

export default function LevelGuide() {
  return (
    <Wrapper>
      <Title>등급 가이드</Title>

      <IconRow>
        <LevelIconWrapper>
          <LevelImage src={beginnerIcon} alt="초보 여행가" />
          <LevelText>Lv 1. 초보 여행가</LevelText>
        </LevelIconWrapper>
        <LevelIconWrapper>
          <LevelImage src={proIcon} alt="프로 탐험가" />
          <LevelText>Lv 2. 프로 탐험가</LevelText>
        </LevelIconWrapper>
        <LevelIconWrapper>
          <LevelImage src={masterIcon} alt="글로벌 마스터" />
          <LevelText>Lv 3. 글로벌 마스터</LevelText>
        </LevelIconWrapper>
        <LevelIconWrapper>
          <LevelImage src={leaderIcon} alt="유니버스 리더" />
          <LevelText>Lv 4. 유니버스 리더</LevelText>
        </LevelIconWrapper>
      </IconRow>

      <Grid>
        <Row className="header">
          <Cell></Cell>
          <Cell>OneDay</Cell>
          <Cell>OneWeek</Cell>
          <Cell>OneMonth</Cell>
          <Cell>WithinSixMonths</Cell>
          <Cell>OverSixMonths</Cell>
        </Row>
        <Row>
          <Cell>CONTEST</Cell>
          <Cell>–</Cell>
          <Cell>–</Cell>
          <Cell>–</Cell>
          <Cell>100P (참가)</Cell>
          <Cell>300P (입상)</Cell>
        </Row>
        <Row>
          <Cell>VOLUNTEER</Cell>
          <Cell>10P</Cell>
          <Cell>50P</Cell>
          <Cell>200P</Cell>
          <Cell>500P</Cell>
          <Cell>1000P</Cell>
        </Row>
        <Row>
          <Cell>SUPPORTERS</Cell>
          <Cell>–</Cell>
          <Cell>–</Cell>
          <Cell>200P</Cell>
          <Cell>500P</Cell>
          <Cell>1000P</Cell>
        </Row>
        <Row>
          <Cell>INTERNSHIP</Cell>
          <Cell>–</Cell>
          <Cell>–</Cell>
          <Cell>–</Cell>
          <Cell>500P</Cell>
          <Cell>1000P</Cell>
        </Row>
      </Grid>

      <XPSection>
        <Row className="header">
          <Cell>Lv1. 초보 여행가</Cell>
          <Cell>Lv2. 프로 탐험가</Cell>
          <Cell>Lv3. 글로벌 마스터</Cell>
          <Cell>Lv4. 유니버스 리더</Cell>
        </Row>
        <Row>
          <Cell>default</Cell>
          <Cell>200</Cell>
          <Cell>1500</Cell>
          <Cell>3000</Cell>
        </Row>
      </XPSection>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  max-width: 2000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;  
  margin-bottom: 40px;
`;

const LevelIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LevelImage = styled.img`
  width: 72px;
  height: 72px;
  margin-bottom: 8px;
`;

const LevelText = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border-top: 2px solid #000;
  border-bottom: 1px solid #ddd;
  margin-bottom: 64px;
`;

const XPSection = styled(Grid)`
  grid-template-columns: repeat(4, 1fr);
  margin-top: 64px;
`;

const Row = styled.div`
  display: contents;

  &.header span {
    font-weight: bold;
    border-bottom: 2px solid #000;
  }
`;

const Cell = styled.span`
  padding: 16px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-size: 14px;
`;
