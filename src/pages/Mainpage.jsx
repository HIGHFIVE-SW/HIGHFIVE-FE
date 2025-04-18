import React from 'react';
import styled from 'styled-components';

import MainNav from '../layout/MainNav/MainNav';
import Footer from '../layout/Footer';
import GlobalCategory from '../components/main/GlobalCategory';
import IssueList from '../components/main/IssueList';

export default function MainPage() {
  return (
    <PageWrapper>
      <MainNav />

      <MainContent>
      <HeroSection>
  <HeroInner>
    <HeroLeft>
      <HeroTitle>최신 글로벌 이슈를 알아보자</HeroTitle>
      <HeroLink>알아보기 &gt;</HeroLink>
    </HeroLeft>
    <HeroRight>
      <HeroImage
        src="/assets/images/Global_issue.png"
        alt="Global Issue"
      />
    </HeroRight>
  </HeroInner>
</HeroSection>

        <GlobalCategory />
        <IssueList />
      </MainContent>

      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

const HeroSection = styled.section`
  width: 100%;
  background-color: #F6FAFF;
  display: flex;
  justify-content: center;
  margin : 0 auto;
  padding: 0;
`;

const HeroInner = styled.div`
  width: 100%;
  
  height: 530px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeroLeft = styled.div`
  margin-left: 100px;
  font-family:NotoSansKR-VariableFont_wght`;

const HeroRight = styled.div``;

const HeroTitle = styled.h2`
  font-size: 70px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const HeroLink = styled.p`
  cursor: pointer;
  font-size: 40px;
`;

const HeroImage = styled.img`
  width: 578px;
  height: 578px;
`;
