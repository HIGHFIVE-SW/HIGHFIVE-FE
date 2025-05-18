import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import ActivityCard from '../components/activity/ActivityCard';
import Pagination from '../components/Pagination';
import usePagination from '../hooks/usePagination';
import activityImage from '../assets/images/activity/ic_ActivityImage.png';

const dummyGlobalIssues = Array.from({ length: 40 }, (_, idx) => ({
  id: idx + 1,
  title: '제 22회 한국 경제 논문 공모전',
  tags: ['#경제', '#공모전'],
  date: '2025.04.15~2025.04.20',
  image: activityImage,
}));

export default function MoreActivityPage() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
  
    const filtered = query
      ? dummyGlobalIssues.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      : dummyGlobalIssues;
  
    const itemsPerPage = 12;
    const {
      currentPage,
      totalPages,
      currentData: paginatedData,
      goToPage,
    } = usePagination(filtered, itemsPerPage);
  
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
          <Subtitle>활동</Subtitle>
          <CardGrid>
            {paginatedData.map((item) => (
              <ActivityCard
                key={item.id}
                title={item.title}
                tags={item.tags}
                image={item.image}
                bookmarked={bookmarkedIds.includes(item.id)}
                onToggle={() => toggleBookmark(item.id)}
              />
            ))}
          </CardGrid>
  
          {filtered.length > itemsPerPage && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
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
