// src/pages/MoreFreePage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainNav from '../../layout/board/BoardNav';
import Footer from '../../layout/Footer';
import FreePostList from '../../components/board/freeboard/FreePostList';
import Pagination from '../../components/common/Pagination';
import { useSearchPosts } from '../../query/usePost';

export default function MoreFreePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  const [currentPage, setCurrentPage] = useState(0);

  // 검색 API 호출 (10개씩)
  const { data: postsData, isLoading, isError } = useSearchPosts(query, currentPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, left: 0 });
  };

  // 자유게시판 데이터를 FreePostList 형식에 맞게 변환
  const transformedPosts = postsData?.content?.map(post => ({
    post_id: post.id,
    post_title: post.title,
    authorName: post.nickname,
    created_at: post.createdAt,
    post_like_count: post.likeCount || 0
  })) || [];

  const totalPages = postsData?.totalPages || 0;
  const totalElements = postsData?.totalElements || 0;

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
          
          {isLoading ? (
            <LoadingMessage>검색 중...</LoadingMessage>
          ) : isError ? (
            <ErrorMessage>검색 중 오류가 발생했습니다.</ErrorMessage>
          ) : (
            <>
              {transformedPosts.length === 0 ? (
                <NoResultsMessage>
                  '{query}'에 대한 검색 결과가 없습니다.
                </NoResultsMessage>
              ) : (
                <FreePostList 
                  posts={transformedPosts}
                  currentPage={currentPage + 1} // UI에서는 1부터 시작
                  itemsPerPage={10}
                />
              )}
              
              {totalPages > 1 && (
                <PaginationWrapper>
                  <Pagination
                    currentPage={currentPage + 1} // UI에서는 1부터 시작
                    totalPages={totalPages}
                    goToPage={(page) => handlePageChange(page - 1)} // API는 0부터 시작
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #e74c3c;
  font-size: 16px;
`;
