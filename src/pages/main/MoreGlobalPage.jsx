// src/pages/MoreGlobalPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import IssueCard from '../../components/issue/IssueCard';
import Pagination from '../../components/common/Pagination';
import usePagination from '../../hooks/usePagination';
import { searchAllIssues } from '../../api/MainSearchApi';

export default function MoreGlobalPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

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

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
              {searchResults.slice(0, 4).map((item) => (
                <IssueCard
                  key={item.id}
                  title={item.title}
                  tag={item.categoryKr || item.keyword || '카테고리 없음'}
                  image={item.image || require('../../assets/images/issue/ic_IssueCardSample.png')}
                  bookmarked={item.bookmarked}
                  onToggle={() => toggleBookmark(item.id)}
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
