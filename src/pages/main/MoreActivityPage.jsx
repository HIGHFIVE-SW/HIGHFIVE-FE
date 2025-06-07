import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import ActivityCard from '../../components/activity/ActivityCard';
import Pagination from '../../components/common/Pagination';
import { searchAllActivities } from '../../api/MainSearchApi';
import { useToggleBookmark } from '../../query/useActivities';
import { formatDate } from '../../utils/formatDate';

export default function MoreActivityPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const location = useLocation();
  const queryClient = useQueryClient();
  const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';
  
  const [currentPage, setCurrentPage] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const toggleBookmark = useToggleBookmark();

  useEffect(() => {
    if (query) {
      fetchSearchResults(query, currentPage);
    }
  }, [query, currentPage]);

  const fetchSearchResults = async (searchQuery, page) => {
    setLoading(true);
    try {
      const response = await searchAllActivities({ 
        keyword: searchQuery,
        activityType: null,
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

  // 북마크 토글 함수 수정 (optimistic update 적용)
  const handleBookmarkToggle = async (activityId) => {
    // 즉시 UI 업데이트 (optimistic update)
    setSearchResults(prevResults => 
      prevResults.map(activity => 
        activity.activityId === activityId 
          ? { ...activity, bookmarked: !activity.bookmarked }
          : activity
      )
    );

    // 서버 요청
    try {
      await toggleBookmark.mutateAsync(activityId);
      
      // 관련 쿼리 무효화
      queryClient.invalidateQueries(['activities']);
      queryClient.invalidateQueries(['bookmarkedActivities']);
    } catch (error) {
      // 실패 시 롤백
      setSearchResults(prevResults => 
        prevResults.map(activity => 
          activity.activityId === activityId 
            ? { ...activity, bookmarked: !activity.bookmarked } // 다시 원래대로
            : activity
        )
      );
      console.error('북마크 토글 실패:', error);
    }
  };

  return (
    <Wrapper>
      <MainNav />
      <Content>
        <Title>'{query}'의 검색 결과</Title>
        <Subtitle>활동</Subtitle>

        {loading ? (
          <LoadingMessage>검색 중...</LoadingMessage>
        ) : searchResults.length === 0 ? (
          <NoResult>검색 결과가 없습니다.</NoResult>
        ) : (
          <>
            <CardGrid>
              {searchResults.map((activity) => {
                // 태그 배열 생성 (키워드와 액티비티 타입 포함)
                const tags = [];
                if (activity.keyword) {
                  tags.push(`#${activity.keyword}`);
                }
                if (activity.activityType) {
                  // activityType을 한글로 변환
                  const typeMap = {
                    'VOLUNTEER': '봉사활동',
                    'CONTEST': '공모전',
                    'SUPPORTERS': '서포터즈',
                    'INTERNSHIP': '인턴십'
                  };
                  tags.push(`#${typeMap[activity.activityType] || activity.activityType}`); 
                }

                return (
                  <ActivityCard
                    key={activity.activityId}
                    id={activity.activityId}
                    title={activity.name}
                    tags={tags} // 키워드와 액티비티 타입이 포함된 태그 배열
                    image={activity.imageUrl}
                    date={`${formatDate(activity.startDate)} ~ ${formatDate(activity.endDate)}`}
                    bookmarked={activity.bookmarked}
                    onToggle={() => handleBookmarkToggle(activity.activityId)}
                    isClosed={new Date() > new Date(activity.endDate)} // 마감 여부 확인
                    siteUrl={activity.siteUrl || 'https://naver.com'}
                  />
                );
              })}
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
