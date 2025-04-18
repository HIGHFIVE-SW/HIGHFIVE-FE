import React, { useState } from 'react';
import styled from 'styled-components';
import MainNav from '../layout/MainNav/MainNav';
import Footer from '../layout/Footer';

const dummyData = [
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    title: '경제 이슈 ' + (i + 1),
    tag: '#경제',
    image: '/assets/images/issue_card_sample.png',
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 5,
    title: '환경 이슈 ' + (i + 1),
    tag: '#환경',
    image: '/assets/images/issue_card_sample.png',
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 9,
    title: '사람과 사회 이슈 ' + (i + 1),
    tag: '#사람과 사회',
    image: '/assets/images/issue_card_sample.png',
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 13,
    title: '기술 이슈 ' + (i + 1),
    tag: '#기술',
    image: '/assets/images/issue_card_sample.png',
  })),
];

const categories = ['전체', '환경', '사람과 사회', '경제', '기술'];

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

      <CategoryTabs>
        {categories.map(cat => (
          <CategoryButton
            key={cat}
            active={activeCategory === cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
          >
            {cat}
          </CategoryButton>
        ))}
      </CategoryTabs>

      <IssueGrid>
        {paginatedData.map(item => (
          <Card key={item.id}>
            <ImageWrapper>
              <CardImage src={item.image} alt="이슈" />
              <BookmarkIcon
                src={bookmarkedIds.includes(item.id)
                  ? '/assets/images/bookmark_filled.svg'
                  : '/assets/images/bookmark.svg'}
                alt="북마크"
                onClick={() => toggleBookmark(item.id)}
              />
            </ImageWrapper>
            <h3>{item.title}</h3>
            <p>{item.tag}</p>
          </Card>
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
  padding: 60px 20px;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
`;

const PageSubtitle = styled.p`
  font-size: 18px;
  color: #555;
  margin-top: 10px;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 30px 0;
`;

const CategoryButton = styled.button`
  background-color: ${props => (props.active ? '#1D4ED8' : '#fff')};
  color: ${props => (props.active ? '#fff' : '#000')};
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
`;

const IssueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 40px 80px;
`;

const Card = styled.div`
  width: 329px;
  height: 418px;
  background-color: #fff;
  border: 2px solid #235BA9;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  position: relative;

  h3 {
    font-size: 16px;
    font-weight: bold;
    margin: 12px 0 8px;
  }

  p {
    font-size: 14px;
    color: #555;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const BookmarkIcon = styled.img`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  z-index: 2;
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