// ReviewBoardGuide.jsx
import React from 'react';
import styled from 'styled-components';

export default function ReviewBoardGuide({ onClose }) {
  return (
    <PopoverContainer onClick={(e) => e.stopPropagation()}>
      <GuideTitle>후기 게시판 가이드</GuideTitle>
      <GuideDescription>
        <GuideMainDescription>
          후기 게시판은 인증 기반 시스템으로 운영됩니다.
          <br />
        </GuideMainDescription>
        <span>
          대외활동의 진정성을 높이고 다른 사용자들에게 실질적인 정보를 제공하기 위해 <br />
          아래 기준을 반드시 따라 주세요.
        </span>
      </GuideDescription>
      <Divider />
      <Section>
        <SectionTitle>인증 사진 필수 제출</SectionTitle>
        <p>후기 작성 시, 활동을 인증할 수 있는 사진을 반드시 첨부해야 합니다.</p>
        <List>
          <ListItem>
            인증 사진 예시 :
            <SubList>
              <SubListItem>합격 문자/이메일</SubListItem>
              <SubListItem>현장 현수막</SubListItem>
              <SubListItem>인증서, 수료증 등</SubListItem>
            </SubList>
          </ListItem>
          <ListItem_1>
              인증 사진이 없는 후기는 포인트 지급에서 제외될 수 있습니다.
          </ListItem_1>
        </List>
      </Section>
      <Section>
        <SectionTitle>인증 사진, 수상 기록은 AI가 판별합니다.</SectionTitle>
        <p>명확하게 식별 가능한 사진을 업로드해 주세요.</p>
      </Section>
      <Section>
        <SectionTitle>수상 기록 등록 시 추가 포인트 지급</SectionTitle>
        <p>공모전 후기 중 수상 이력이 있는 경우 수상 사진을 등록하면 추가 포인트가 제공됩니다.</p>
      </Section>
    </PopoverContainer>
  );
}

const PopoverContainer = styled.div`
  position: absolute;
  right: 10px;
  z-index: 1000;
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 500px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
  text-align: left;
`;

const GuideTitle = styled.h2`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const GuideDescription = styled.p`
  color: #235ba9;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.5;
  word-break: keep-all;
`;


const GuideMainDescription = styled.span`
  font-weight: 600;
`;

const Section = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const Divider = styled.hr`
  border: 0.5px solid #000;
  margin: 8px 0;
`;
const List = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 4px;
`;

const ListItem = styled.li`
  margin-bottom: 6px;
`;

const ListItem_1 = styled.li`
  font-weight: 600;
`;

const SubList = styled.ul`
  list-style-type: circle;
  padding-left: 20px;
  margin-top: 4px;
`;

const SubListItem = styled.li`
  margin-bottom: 4px;
`;

