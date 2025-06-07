// src/pages/MoreGlobalPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import IssueCard from '../../components/issue/IssueCard';
import Pagination from '../../components/common/Pagination';
import { searchAllIssues } from '../../api/MainSearchApi';
import { useToggleIssueBookmark } from '../../query/useIssues';
import { useQueryClient } from '@tanstack/react-query';

export default function MoreGlobalPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const toggleIssueBookmark = useToggleIssueBookmark();

  useEffect(() => {
    if (query) {
      fetchSearchResults(query, currentPage);
    }
  }, [query, currentPage]);

  const fetchSearchResults = async (searchQuery, page) => {
    setLoading(true);
    try {
      const response = await searchAllIssues({ 
        keyword: searchQuery, 
        page,
        size: 12 
      });
      if (response.isSuccess) {
        setSearchResults(response.result.content);
        setTotalPages(response.result.totalPages);
      }
    } catch (error) {
      console.error('검색 결과를 가져오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalBookmark = (id) => {
    toggleIssueBookmark.mutate(id, {
      onSuccess: () => {
        // 검색 결과 업데이트
        setSearchResults(prevResults => 
          prevResults.map(issue => 
            issue.id === id 
              ? { ...issue, bookmarked: !issue.bookmarked }
              : issue
          )
        );
        // 관련 쿼리 무효화
        queryClient.invalidateQueries(['issues']);
        queryClient.invalidateQueries(['bookmarkedIssues']);
      }
    });
  };

  return (
    <Wrapper>
      <MainNav />
      <Content>
        <Title>'{query}'의 검색 결과</Title>
        <Subtitle>글로벌 이슈</Subtitle>
        {loading ? (
          <LoadingMessage>검색 중...</LoadingMessage>
        ) : searchResults.length === 0 ? (
          <NoResult>검색 결과가 없습니다.</NoResult>
        ) : (
          <>
            <CardGrid>
              {searchResults.map((item) => (
                <IssueCard
                  key={item.id}
                  title={item.title}
                  tag={`#${item.keyword}` || '#카테고리 없음'}
                  image={item.imageUrl || ''}
                  bookmarked={item.bookmarked}
                  onToggle={() => handleGlobalBookmark(item.id)}
                  onClick={() => navigate(`/global-issue/${item.id}`, {
                    state: { label: item.keyword, title: item.title }
                  })}
                />
              ))}
            </CardGrid>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                goToPage={(page) => setCurrentPage(page - 1)}
              />
            )}
          </>
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

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 40px;
`;

const NoResult = styled.p`
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 40px;
`;
