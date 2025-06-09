// src/pages/MoreReviewPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import MainNav from '../../layout/board/BoardNav';
import Footer from '../../layout/Footer';
import ReviewCard from '../../components/board/reviewboard/ReviewCard';
import Pagination from '../../components/common/Pagination';
import { useSearchReviews } from '../../query/usePost';
import { formatDate } from '../../utils/formatDate';
import SampleReviewImg from "../../assets/images/board/SampleReviewImg.png";
import { getReviews } from '../../api/PostApi';

// 키워드 매핑 (API 영어 → UI 한국어)
const KEYWORD_MAP = {
  'Environment': '환경',
  'PeopleAndSociety': '사람과 사회',
  'Economy': '경제',
  'Technology': '기술'
};

// 이미지 URL 유효성 검사 함수
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // 기본 URL 형식 검사
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 이미지 URL 추출 함수 개선
const extractImageUrl = (review) => {
  console.log('이미지 URL 추출 시작:', {
    id: review.id,
    title: review.title,
    availableFields: Object.keys(review).filter(key => 
      key.toLowerCase().includes('image') || key.toLowerCase().includes('url')
    )
  });

  // 우선순위별로 이미지 URL 확인
  const imageFields = [
    review.imageUrls?.[0],           // 첫 번째 이미지 URL
    review.reviewImageUrls?.[0],     // 첫 번째 리뷰 이미지 URL
    review.imageUrl,                 // 단일 이미지 URL
    review.image,                    // 이미지 필드
    review.thumbnailUrl,             // 썸네일 URL (혹시 있을 수 있음)
    review.coverImage,               // 커버 이미지 (혹시 있을 수 있음)
  ];

  console.log('이미지 필드 확인:', {
    id: review.id,
    imageFields: imageFields.map((field, index) => ({
      index,
      value: field,
      isValid: isValidImageUrl(field)
    }))
  });

  for (const imageUrl of imageFields) {
    if (isValidImageUrl(imageUrl)) {
      console.log('유효한 이미지 URL 발견:', {
        id: review.id,
        imageUrl,
        fieldIndex: imageFields.indexOf(imageUrl)
      });
      return imageUrl;
    }
  }

  console.log('유효한 이미지 URL 없음, 기본 이미지 사용:', {
    id: review.id,
    title: review.title,
    sampleImagePath: SampleReviewImg
  });
  
  return SampleReviewImg; // 기본 이미지 반환
};

export default function MoreReviewPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewsData, setReviewsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // 리뷰 데이터 가져오기 (검색 필터링 포함)
  useEffect(() => {
    const fetchReviews = async () => {
      if (!query) return;
      
      setIsLoading(true);
      setIsError(false);
      
      try {
        // 전체 리뷰 데이터를 가져와서 클라이언트에서 검색 필터링
        const result = await getReviews(currentPage, null, null, 'RECENT');
        
        // 검색어가 있으면 필터링
        if (query) {
          const filteredContent = result.content.filter(review => 
            review.title.toLowerCase().includes(query.toLowerCase()) ||
            review.content.toLowerCase().includes(query.toLowerCase()) ||
            review.nickname.toLowerCase().includes(query.toLowerCase())
          );
          
          // 페이지네이션을 위한 계산 (9개씩)
          const itemsPerPage = 9;
          const startIndex = currentPage * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedContent = filteredContent.slice(startIndex, endIndex);
          const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
          
          setReviewsData({
            content: paginatedContent,
            totalPages,
            totalElements: filteredContent.length
          });
        } else {
          setReviewsData(result);
        }
        
      } catch (error) {
        console.error('리뷰 검색 실패:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [query, currentPage]);

  // API 응답 데이터 상세 로깅
  useEffect(() => {
    if (reviewsData?.content) {
      console.log('=== API 응답 상세 분석 ===');
      reviewsData.content.forEach((review, index) => {
        console.log(`리뷰 ${index + 1}:`, {
          id: review.id,
          title: review.title,
          // 모든 이미지 관련 필드 확인
          imageFields: Object.entries(review)
            .filter(([key]) => key.toLowerCase().includes('image') || key.toLowerCase().includes('url'))
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {}),
          // 전체 필드 목록
          allFields: Object.keys(review)
        });
      });
    }
  }, [reviewsData]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, left: 0 });
  };

  // 리뷰 데이터를 ReviewCard 형식에 맞게 변환
  const transformedReviews = reviewsData?.content?.map(review => {
    const imageUrl = extractImageUrl(review);
    
    return {
      id: review.id,
      category: KEYWORD_MAP[review.keyword] || review.keyword || '일반',
      title: review.title,
      content: review.content,
      image: imageUrl,
      date: formatDate(review.createdAt),
      writer: review.nickname,
      likeCount: review.likeCount || 0
    };
  }) || [];

  // 최종 변환 결과 로깅
  console.log('=== 최종 변환 결과 ===', {
    totalReviews: transformedReviews.length,
    reviewsWithImages: transformedReviews.filter(r => r.image !== SampleReviewImg).length,
    reviewsWithDefaultImage: transformedReviews.filter(r => r.image === SampleReviewImg).length,
    sampleData: transformedReviews.slice(0, 3).map(r => ({
      id: r.id,
      title: r.title,
      hasCustomImage: r.image !== SampleReviewImg,
      imageUrl: r.image
    }))
  });

  const totalPages = reviewsData?.totalPages || 0;

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
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    goToPage={(page) => handlePageChange(page - 1)}
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
