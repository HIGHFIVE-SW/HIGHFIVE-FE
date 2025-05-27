// src/pages/MoreFreePage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import MainNav from '../../layout/board/BoardNav';
import Footer from '../../layout/Footer';
import FreePostList from '../../components/board/freeboard/FreePostList';
import Pagination from '../../components/common/Pagination';
import usePagination from '../../hooks/usePagination';

const dummyFreePosts = Array.from({ length: 50 }, (_, idx) => ({
  post_id: idx + 1,
  post_title: `공모전 공모 대회의 공모전 나갈 사람? ${idx + 1}`,
  authorName: idx % 3 === 0 ? '이서현' : idx % 3 === 1 ? '김민수' : '박영희',
  created_at: '2025-04-14T10:00:00',
  post_like_count: Math.floor(Math.random() * 50) + 1
}));

export default function MoreFreePage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  const finalPosts = query
    ? dummyFreePosts.filter(
        (item) =>
          item.post_title.toLowerCase().includes(query.toLowerCase()) ||
          item.authorName.toLowerCase().includes(query.toLowerCase())
      )
    : dummyFreePosts;

  const itemsPerPage = 10;

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
            <Title>자유 게시판</Title>
          )}
          <Subtitle>자유 게시판</Subtitle>
          
          {finalPosts.length === 0 ? (
            <NoResultsMessage>
              '{query}'에 대한 검색 결과가 없습니다.
            </NoResultsMessage>
          ) : (
            <>
              <FreePostList 
                posts={finalPosts.length <= itemsPerPage ? finalPosts : paginatedPosts}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
              {finalPosts.length > itemsPerPage && (
                <PaginationWrapper>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                  />
                </PaginationWrapper>
              )}
            </>
          )}
        </Content>
      </Container>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex-direction: column;
  width: 1000px
  align-items: center;
`;

const Container = styled.div`
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
  margin-left: 12px;
`;

const Subtitle = styled.h3`
  font-size: 20px;
  color: #999;
  margin-bottom: 16px;
  margin-left: 20px;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;
