// src/pages/SearchResultPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MainNav from '../../layout/board/BoardNav';
import Footer from '../../layout/Footer';
import SearchBar from '../../components/search/SearchBar';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewCard from '../../components/board/reviewboard/ReviewCard';
import FreePostList from '../../components/board/freeboard/FreePostList';
import { useSearchReviews, useSearchPosts } from '../../query/usePost';

// 키워드 매핑 (API 영어 → UI 한국어)
const KEYWORD_MAP = {
  'Environment': '환경',
  'PeopleAndSociety': '사람과 사회',
  'Economy': '경제',
  'Technology': '기술'
};

export default function BoardSearchResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef();

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromURL = params.get('query');
    if (queryFromURL) {
      setInputValue(queryFromURL);
      setSearchQuery(queryFromURL);
    }
  }, [location.search]);

  // 검색 API 호출 (페이지 0으로 고정, 각각 3개씩 가져올 예정)
  const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError } = useSearchReviews(searchQuery, 0);
  const { data: postsData, isLoading: postsLoading, isError: postsError } = useSearchPosts(searchQuery, 0);

  const handleSearch = () => {
    if (inputValue.trim()) {
      // 게시판 검색이므로 board 경로 사용
      navigate(`/board/search?query=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const handleReviewMoreClick = () => {
    // MoreReviewPage로 이동
    navigate(`/more/review?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleFreeMoreClick = () => {
    // MoreFreePage로 이동
    navigate(`/more/free?query=${encodeURIComponent(searchQuery)}`);
  };

  // 검색 결과 데이터 가공 (3개로 제한)
  const reviewResults = reviewsData?.content?.slice(0, 3) || [];
  const postResults = postsData?.content?.slice(0, 3) || [];

  // 리뷰 데이터를 ReviewCard 형식에 맞게 변환
  const transformedReviews = reviewResults.map(review => ({
    id: review.id,
    category: KEYWORD_MAP[review.keyword] || review.keyword || '일반',
    title: review.title,
    content: review.content,
    image: review.reviewImageUrls?.[0] || null,
    date: review.createdAt ? new Date(review.createdAt).toLocaleDateString('ko-KR').replace(/\./g, '.').replace(/ /g, '') : '',
    writer: review.nickname,
    likeCount: review.likeCount || 0
  }));

  // 자유게시판 데이터를 FreePostList 형식에 맞게 변환
  const transformedPosts = postResults.map(post => ({
    post_id: post.id,
    post_title: post.title,
    authorName: post.nickname,
    created_at: post.createdAt,
    post_like_count: post.likeCount || 0
  }));

  return (
    <Wrapper>
      <MainNav />
      <Container>
        <MainContent>
          <SearchHeader>
            <SearchBar
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSearch={handleSearch}
              placeholder="검색어를 입력해주세요."
              inputRef={inputRef}
            />
          </SearchHeader>

          <ResultTitle>'{searchQuery}'의 검색 결과</ResultTitle>

          <Section>
            <SectionHeader>
              <SectionTitle>후기 게시판</SectionTitle>
              {reviewsData?.content?.length > 3 && (
                <MoreButton onClick={handleReviewMoreClick}>더보기 &gt;</MoreButton>
              )}
            </SectionHeader>
            
            {reviewsLoading ? (
              <LoadingMessage>검색 중...</LoadingMessage>
            ) : reviewsError ? (
              <ErrorMessage>검색 중 오류가 발생했습니다.</ErrorMessage>
            ) : transformedReviews.length === 0 ? (
              <NoResultsMessage>검색 결과가 없습니다.</NoResultsMessage>
            ) : (
              <PopularCardsGrid>
                {transformedReviews.map((post) => (
                  <ReviewCard
                    key={post.id}
                    id={post.id}
                    category={post.category}
                    image={post.image}
                    title={post.title}
                    content={post.content}
                    date={post.date}
                    writer={post.writer}
                    likeCount={post.likeCount}
                  />
                ))}
              </PopularCardsGrid>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>자유 게시판</SectionTitle>
              {postsData?.content?.length > 3 && (
                <MoreButton onClick={handleFreeMoreClick}>더보기 &gt;</MoreButton>
              )}
            </SectionHeader>
            
            {postsLoading ? (
              <LoadingMessage>검색 중...</LoadingMessage>
            ) : postsError ? (
              <ErrorMessage>검색 중 오류가 발생했습니다.</ErrorMessage>
            ) : transformedPosts.length === 0 ? (
              <NoResultsMessage>검색 결과가 없습니다.</NoResultsMessage>
            ) : (
              <FreePostList 
                posts={transformedPosts}
                currentPage={1}
                itemsPerPage={10}
              />
            )}
          </Section>
        </MainContent>
      </Container>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
`;

const MainContent = styled.div`
  flex: 1;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const ResultTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #666;
  margin-left: 15px;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  margin-top: 50px;
  
  &:hover {
    color: #1C4987;
  }
`;

const PopularCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
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

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;
