import React from 'react';
import styled from 'styled-components';

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterText>© 2025, HIGHFIVE. All Rights Reserved</FooterText>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  width: 100%;
  background-color: #235BA9; 
  padding: 24px 0;
  text-align: center;
  position: relative;
  bottom: 0;
`;

const FooterText = styled.p`
  color: white;
  font-size: 14px;
  margin: 0;
`;
