// src/pages/MoreReviewPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import MainNav from '../../layout/board/BoardNav';
import Footer from '../../layout/Footer';
import ReviewCard from '../../components/board/reviewboard/ReviewCard';
import Pagination from '../../components/common/Pagination';
import usePagination from '../../hooks/usePagination';
import SampleReviewImg from '../../assets/images/board/SampleReviewImg.png';

const dummyReviewPosts = Array.from({ length: 40 }, (_, idx) => ({
  id: idx + 1,
  category: idx % 4 === 0 ? '환경' : idx % 4 === 1 ? '기술' : idx % 4 === 2 ? '사람과 사회' : '경제',
  title: '국제수산업발달협회 아이디어 공모전 후기',
  image: SampleReviewImg,
  content: '공모전에 참여한 후기를 공유합니다. 이번 공모전을 통해 많은 것을 배웠고, 특히 팀워크의 중요성을 깨달았습니다.',
  date: '2025.04.14',
  writer: '김철수',
  likeCount: 25
}));

export default function MoreReviewPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  const finalPosts = query
    ? dummyReviewPosts.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase())
      )
    : dummyReviewPosts;

  const itemsPerPage = 9;

  const {
    currentPage,
    totalPages,
    currentData: paginatedPosts,
    goToPage,
  } = usePagination(finalPosts, itemsPerPage);

  return (
    <Wrapper>
      <MainNav />
      <Container>
        <Content>
          {query ? (
            <Title>'{query}'의 검색 결과</Title>
          ) : (
            <Title>후기 게시판</Title>
          )}
          <Subtitle>후기 게시판</Subtitle>
          <CardGrid>
            {finalPosts.length === 0 ? (
              <NoResultsMessage>
                '{query}'에 대한 검색 결과가 없습니다.
              </NoResultsMessage>
            ) : (
              (finalPosts.length <= itemsPerPage ? finalPosts : paginatedPosts).map((item) => (
                <ReviewCard
                  key={item.id}
                  id={item.id}
                  category={item.category}
                  image={item.image}
                  title={item.title}
                  content={item.content}
                  date={item.date}
                  writer={item.writer}
                  likeCount={item.likeCount}
                />
              ))
            )}
          </CardGrid>
          {finalPosts.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          )}
        </Content>
      </Container>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px 0;
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 24px;
`;

const Subtitle = styled.h3`
  font-size: 20px;
  color: #999;
  margin-bottom: 25px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
  margin-bottom: 40px;
`;

const NoResultsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;
