import React, { useState } from 'react';
import styled from 'styled-components';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import IssueCard from '../components/IssueCard'; 
import CategoryFilter from '../components/common/CategoryFilter';

import issueCardSample from '../assets/images/main/ic_IssueCardSample.png';
import issueCardNo from '../assets/images/main/ic_NoImage.png';

const dummyData = [
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    title: '경제 이슈 ' + (i + 1),
    tag: '#경제',
    image: issueCardNo,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 5,
    title: '환경 이슈 ' + (i + 1),
    tag: '#환경',
    image: issueCardSample,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 9,
    title: '사람과 사회 이슈 ' + (i + 1),
    tag: '#사람과 사회',
    image: issueCardSample,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 13,
    title: '기술 이슈 ' + (i + 1),
    tag: '#기술',
    image: issueCardSample,
  })),
];


export default function GlobalIssuePage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const itemsPerPage = 12;

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const filteredData =
    activeCategory === '전체'
      ? dummyData
      : dummyData.filter(item => item.tag.includes(activeCategory));

  const paginatedData =
    activeCategory === '전체'
      ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : filteredData;

  const totalPages = Math.ceil(
    activeCategory === '전체'
      ? filteredData.length / itemsPerPage
      : 1
  );

  return (
    <Wrapper>
      <MainNav />

      <HeaderSection>
        <PageTitle>글로벌 이슈</PageTitle>
        <PageSubtitle>세계 주요 이슈를 파악하고 관련 활동을 살펴보자</PageSubtitle>
      </HeaderSection>

      <CategoryFilter
        selectedCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentPage(1);
        }}
/>

      <IssueGrid>
        {paginatedData.map(item => (
          <IssueCard
            key={item.id}
            id={item.id}
            title={item.title}
            tag={item.tag}
            image={item.image}
            bookmarked={bookmarkedIds.includes(item.id)}
            onToggle={toggleBookmark}
          />
        ))}
      </IssueGrid>

      {activeCategory === '전체' && (
        <Pagination>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PageNumber
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageNumber>
          ))}
          {currentPage < totalPages && (
            <NextButton onClick={() => setCurrentPage(prev => prev + 1)}>
              NEXT &gt;
            </NextButton>
          )}
        </Pagination>
      )}

      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background-color: #F9FBFF;
  text-align: center;
  padding: 50px 0;
`;

const PageTitle = styled.h1`
  font-size: 44px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-size: 24px;
  color: #656565;
  margin: 20px 0 0;
`;

const IssueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 40px 0;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 60px;
`;

const PageNumber = styled.button`
  background-color: ${props => (props.active ? 'rgba(29, 78, 216, 0.05)' : 'transparent')};
  color: ${props => (props.active ? '#1D4ED8' : '#000')};
  border: none;
  font-size: 16px;
  font-weight: ${props => (props.active ? '600' : '400')};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const NextButton = styled.button`
  background: none;
  border: none;
  color: #000000;
  font-weight: bold;
  cursor: pointer;
`;
