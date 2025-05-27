// src/pages/MoreGlobalPage.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import IssueCard from '../components/issue/IssueCard';
import Pagination from '../components/common/Pagination';
import globalImage from '../assets/images/issue/ic_IssueCardSample.png';
import usePagination from '../hooks/usePagination';

const dummyGlobalIssues = Array.from({ length: 40 }, (_, idx) => ({
  id: idx + 1,
  title: '제 22회 한국 경제 논문 공모전',
  tag: '#경제',
  image: globalImage,
}));

export default function MoreGlobalPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

  const finalIssues = query
    ? dummyGlobalIssues.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.tag.toLowerCase().includes(query)
      )
    : dummyGlobalIssues;

  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const itemsPerPage = 12;

  const {
    currentPage,
    totalPages,
    currentData: paginatedIssues,
    goToPage,
  } = usePagination(finalIssues, itemsPerPage);

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    );
  };

  return (
    <Wrapper>
      <MainNav />
      <Content>
        <Title>‘{query}’의 검색 결과</Title>
        <Subtitle>글로벌 이슈</Subtitle>
        <CardGrid>
          {(finalIssues.length === 1 ? finalIssues : paginatedIssues).map((item) => (
            <IssueCard
              key={item.id}
              title={item.title}
              tag={item.tag}
              image={item.image}
              bookmarked={bookmarkedIds.includes(item.id)}
              onToggle={() => toggleBookmark(item.id)}
            />
          ))}
        </CardGrid>
        {finalIssues.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        )}
      </Content>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  padding: 40px 60px 40px 38px;
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 24px;
`;

const Subtitle = styled.h3`
  font-size: 20px;
  color: #999;
  margin-bottom: 16px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
`;
