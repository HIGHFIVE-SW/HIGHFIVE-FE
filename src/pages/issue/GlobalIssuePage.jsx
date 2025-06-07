import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import IssueCard from '../../components/issue/IssueCard'; 
import CategoryFilter from '../../components/common/CategoryFilter';
import Pagination from '../../components/common/Pagination';
import { useIssues, useIssuesByKeyword, useToggleIssueBookmark } from '../../query/useIssues';

export default function GlobalIssuePage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(0);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const navigate = useNavigate();

  // 조건부 API 호출
  const { data: allIssues, isLoading: allLoading, error: allError } = useIssues(currentPage);
  const { data: keywordIssues, isLoading: keywordLoading, error: keywordError } = useIssuesByKeyword({
    keyword: activeCategory,
    page: currentPage
  });

  const toggleBookmark = useToggleIssueBookmark();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    if (query) setActiveCategory(query);
  }, [query]);

  const handleBookmarkToggle = (issueId) => {
    toggleBookmark.mutate(issueId);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  // 현재 카테고리에 따라 적절한 데이터 선택
  const isShowingAll = activeCategory === '전체';
  const currentData = isShowingAll ? allIssues : keywordIssues;
  const isLoading = isShowingAll ? allLoading : keywordLoading;
  const error = isShowingAll ? allError : keywordError;

  if (isLoading) {
    return (
      <Wrapper>
        <MainNav />
        <LoadingContainer>
          <p>이슈를 불러오는 중...</p>
        </LoadingContainer>
        <Footer />
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <MainNav />
        <ErrorContainer>
          <p>이슈를 불러오는데 실패했습니다: {error.message}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </ErrorContainer>
        <Footer />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <MainNav />

      <HeaderSection>
        <PageTitle>글로벌 이슈</PageTitle>
        <PageSubtitle>세계 주요 이슈를 파악하고 관련 활동을 살펴보자</PageSubtitle>
      </HeaderSection>

      <CategoryFilter
        selectedCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
      />

      <IssueGrid>
        {currentData?.content?.map(issue => (
          <IssueCard
            key={issue.id}
            id={issue.id}
            title={issue.title}
            tag={issue.category}
            image={issue.thumbnailUrl}
            bookmarked={issue.bookmarked}
            onToggle={() => handleBookmarkToggle(issue.id)}
            onClick={() => navigate(`/global-issue/${issue.id}`, { 
              state: { label: issue.category, title: issue.title } 
            })} 
          />
        )) || []}
      </IssueGrid>

      {currentData?.totalPages > 1 && (
        <Pagination 
          currentPage={currentPage + 1} 
          totalPages={currentData.totalPages} 
          goToPage={handlePageChange} 
        />
      )}

      <Footer />
    </Wrapper>
  );
}

// 스타일 컴포넌트들은 기존과 동일...


// 기존 스타일 + 추가 스타일
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 20px;
  
  button {
    padding: 10px 20px;
    background-color: #235BA9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;



const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background-color: #F9FBFF;
  text-align: center;
  padding: 50px 0;
`;

const PageTitle = styled.h1`
  font-size: 44px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-size: 24px;
  color: #656565;
  margin: 20px 0 0;
`;

const IssueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 40px 0;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
`;
