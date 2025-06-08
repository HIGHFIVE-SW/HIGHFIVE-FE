// src/pages/MoreReviewPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainNav from '../../layout/board/BoardNav';
import Footer from '../../layout/Footer';
import ReviewCard from '../../components/board/reviewboard/ReviewCard';
import Pagination from '../../components/common/Pagination';
import { useSearchReviews } from '../../query/usePost';

// 키워드 매핑 (API 영어 → UI 한국어)
const KEYWORD_MAP = {
  'Environment': '환경',
  'PeopleAndSociety': '사람과 사회',
  'Economy': '경제',
  'Technology': '기술'
};

export default function MoreReviewPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  const [currentPage, setCurrentPage] = useState(0);

  // 검색 API 호출 (9개씩)
  const { data: reviewsData, isLoading, isError } = useSearchReviews(query, currentPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, left: 0 });
  };

  // 리뷰 데이터를 ReviewCard 형식에 맞게 변환
  const transformedReviews = reviewsData?.content?.map(review => ({
    id: review.id,
    category: KEYWORD_MAP[review.keyword] || review.keyword || '일반',
    title: review.title,
    content: review.content,
    image: review.reviewImageUrls?.[0] || null,
    date: review.createdAt ? new Date(review.createdAt).toLocaleDateString('ko-KR').replace(/\./g, '.').replace(/ /g, '') : '',
    writer: review.nickname,
    likeCount: review.likeCount || 0
  })) || [];

  const totalPages = reviewsData?.totalPages || 0;
  const totalElements = reviewsData?.totalElements || 0;

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
          
          {isLoading ? (
            <LoadingMessage>검색 중...</LoadingMessage>
          ) : isError ? (
            <ErrorMessage>검색 중 오류가 발생했습니다.</ErrorMessage>
          ) : (
            <>
              <CardGrid>
                {transformedReviews.length === 0 ? (
                  <NoResultsMessage>
                    '{query}'에 대한 검색 결과가 없습니다.
                  </NoResultsMessage>
                ) : (
                  transformedReviews.map((item) => (
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;
