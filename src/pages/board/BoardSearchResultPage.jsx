// src/pages/SearchResultPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MainNav from '../../layout/board/BoardNav';
import Footer from '../../layout/Footer';
import SearchBar from '../../components/search/SearchBar';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewCard from '../../components/board/reviewboard/ReviewCard';
import FreePostList from '../../components/board/freeboard/FreePostList';
import SampleReviewImg from '../../assets/images/board/SampleReviewImg.png';

const dummyRecentPosts = [
  { 
    post_id: 1, 
    post_title: '공모전 공모 대회의 공모전 나갈 사람?', 
    authorName: '이서현', 
    created_at: '2025-04-14T10:00:00', 
    post_like_count: 14 
  },
  { 
    post_id: 2, 
    post_title: '공모전 공모 대회의 공모전 나갈 사람?', 
    authorName: '이서현', 
    created_at: '2025-04-14T10:00:00', 
    post_like_count: 14 
  },
  { 
    post_id: 3, 
    post_title: '공모전 공모 대회의 공모전 나갈 사람?', 
    authorName: '이서현', 
    created_at: '2025-04-14T10:00:00', 
    post_like_count: 14 
  },
];

const dummyPopularPosts = [
  { 
    id: 1, 
    category: '환경', 
    title: '국제수산업발달협회 아이디어 공모전 후기', 
    image: SampleReviewImg,
    content: '공모전에 참여한 후기를 공유합니다. 이번 공모전을 통해 많은 것을 배웠고, 특히 팀워크의 중요성을 깨달았습니다.',
    date: '2025.04.14',
    writer: '김철수',
    likeCount: 25
  },
  { 
    id: 2, 
    category: '사람과 사회', 
    title: '국제수산업발달협회 아이디어 공모전 후기', 
    image: SampleReviewImg,
    content: '취업 준비하면서 참여한 공모전 경험을 공유합니다. 실무 경험을 쌓을 수 있는 좋은 기회였습니다.',
    date: '2025.04.13',
    writer: '이영희',
    likeCount: 18
  },
  { 
    id: 3, 
    category: '기술', 
    title: '국제수산업발달협회 아이디어 공모전 후기', 
    image: SampleReviewImg,
    content: '공모전 준비 과정과 결과에 대한 이야기를 나누고 싶습니다. 처음 참여해본 공모전이었지만 많은 것을 얻었습니다.',
    date: '2025.04.12',
    writer: '박민수',
    likeCount: 32
  },
];

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
              <MoreButton onClick={handleReviewMoreClick}>더보기 &gt;</MoreButton>
            </SectionHeader>
            <PopularCardsGrid>
              {dummyPopularPosts.map((post) => (
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
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>자유 게시판</SectionTitle>
              <MoreButton onClick={handleFreeMoreClick}>더보기 &gt;</MoreButton>
            </SectionHeader>
            <FreePostList 
              posts={dummyRecentPosts}
              currentPage={1}
              itemsPerPage={10}
            />
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
