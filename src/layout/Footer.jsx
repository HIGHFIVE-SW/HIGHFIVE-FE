import React from 'react';
import styled from 'styled-components';

export default function Footer() {
  return (
      <ContentSection>
    <FooterWrapper>
      <p>© 2025 Trendist. All rights reserved.</p>
    </FooterWrapper>
        </ContentSection> 
  );
}

const FooterWrapper = styled.footer`
  width: 100vw;              
  padding: 20px;
  margin-top: 40px;
  text-align: center;
  background-color: #235BA9;
  font-size: 14px;
  color: #fff;              
  flex-shrink: 0;
  margin-left: calc(-50vw + 50%); 
`;

const ContentSection = styled.div`
  flex: 1; // 내용이 밀리더라도 Footer는 항상 아래로
  padding: 40px 80px;
`;
