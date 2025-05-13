// ReviewBoardGuide.jsx
import React from 'react';
import styled from 'styled-components';

export default function ReviewBoardGuide({ onClose }) {
  return (
    <PopoverContainer onClick={(e) => e.stopPropagation()}>
      <CloseButton onClick={onClose}>✕</CloseButton>
      <GuideTitle>후기 게시판 가이드</GuideTitle>
      <GuideDescription>
        후기 게시판은 인증 기반 시스템으로 운영됩니다.<br />
        대외활동의 진정성을 높이고 다른 사용자들에게 실질적인 정보를 제공하기 위해<br />
        아래 기준을 반드시 따라 주세요.
      </GuideDescription>
      <Section>
        <SectionTitle>인증 사진 필수 제출</SectionTitle>
        <p>후기 작성 시, 활동을 인증할 수 있는 사진을 반드시 첨부해야 합니다.</p>
        <ul>
          <li>인증 사진 예시 : 합격 문자/이메일, 현장 현수막, 인증서/수료증 등</li>
          <li><strong>인증 사진이 없는 후기는 포인트 지급에서 제외될 수 있습니다.</strong></li>
        </ul>
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
  width: 400px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const GuideTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const GuideDescription = styled.p`
  font-size: 13px;
  color: #444;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const Section = styled.div`
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
`;
