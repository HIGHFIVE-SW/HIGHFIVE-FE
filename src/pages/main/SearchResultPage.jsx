// src/pages/SearchResultPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import IssueCard from '../../components/issue/IssueCard';
import ActivityCard from '../../components/activity/ActivityCard';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/search/SearchBar';
import { searchIssues, searchActivities } from '../../api/MainSearchApi';
import { useToggleIssueBookmark } from '../../query/useIssues';
import { useToggleBookmark } from '../../query/useActivities';
import { formatDate } from '../../utils/formatDate';

export default function SearchResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef();
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activityResults, setActivityResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleIssueBookmark = useToggleIssueBookmark();
  const toggleActivityBookmark = useToggleBookmark();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromURL = params.get('query');
    if (queryFromURL) {
      setInputValue(queryFromURL);
      setSearchQuery(queryFromURL);
      fetchSearchResults(queryFromURL);
    }
  }, [location.search]);

  const fetchSearchResults = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const [issuesResponse, activitiesResponse] = await Promise.all([
        searchIssues({ keyword: query }),
        searchActivities({ keyword: query, activityType: null })
      ]);
      
      if (issuesResponse.isSuccess) {
        setSearchResults(issuesResponse.result.content);
      }
      if (activitiesResponse.isSuccess) {
        setActivityResults(activitiesResponse.result.content);
      }
    } catch (error) {
      console.error('검색 결과를 가져오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/search?query=${inputValue.trim()}`);
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

  // 활동 북마크 토글 함수 수정 (글로벌 이슈 상세페이지 참고)
  const handleActivityBookmark = async (activityId) => {
    // 즉시 UI 업데이트 (optimistic update)
    setActivityResults(prevResults => 
      prevResults.map(activity => 
        activity.activityId === activityId 
          ? { ...activity, bookmarked: !activity.bookmarked }
          : activity
      )
    );

    // 서버 요청
    try {
      await toggleActivityBookmark.mutateAsync(activityId);
      
      // 관련 쿼리 무효화
      queryClient.invalidateQueries(['activities']);
      queryClient.invalidateQueries(['bookmarkedActivities']);
    } catch (error) {
      // 실패 시 롤백
      setActivityResults(prevResults => 
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
        <SearchHeader>
            <SearchBar
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSearch={handleSearch}
              placeholder="검색어를 입력해주세요."
              inputRef={inputRef}
            />
        </SearchHeader>

        {searchQuery && (
          <>
            <ResultTitle>'{searchQuery}'의 검색 결과</ResultTitle>

            {loading ? (
              <LoadingMessage>검색 중...</LoadingMessage>
            ) : searchResults.length === 0 && activityResults.length === 0 ? (
              <NoResult>검색 결과가 없습니다.</NoResult>
            ) : (
              <>
                {searchResults.length > 0 && (
                  <Section>
                    <SectionHeader>
                      <h3>글로벌 이슈</h3>
                      {searchResults.length > 5 && (
                        <MoreBtn onClick={() => navigate(`/more/global?query=${searchQuery}`)}>
                          더보기 &gt;
                        </MoreBtn>
                      )}
                    </SectionHeader>
                    <CardGrid>
                      {searchResults.slice(0, 4).map((issue) => (
                        <IssueCard
                          key={issue.id}
                          id={issue.id}
                          title={issue.title}
                          tag={`#${issue.keyword}` || '#카테고리 없음'}
                          image={issue.imageUrl || ''}
                          bookmarked={issue.bookmarked}
                          onToggle={() => handleGlobalBookmark(issue.id)}
                          onClick={() => navigate(`/global-issue/${issue.id}`, {
                            state: { label: issue.keyword, title: issue.title }
                          })}
                        />
                      ))}
                    </CardGrid>
                  </Section>
                )}

                {activityResults.length > 0 && (
                  <Section>
                    <SectionHeader>
                      <h3>활동</h3>
                      {activityResults.length > 4 && (
                        <MoreBtn onClick={() => navigate(`/more/activity?query=${searchQuery}`)}>
                          더보기 &gt;
                        </MoreBtn>
                      )}
                    </SectionHeader>
                    <CardGrid>
                      {activityResults.slice(0, 4).map((activity) => {
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
                            onToggle={() => handleActivityBookmark(activity.activityId)}
                            isClosed={new Date() > new Date(activity.endDate)} // 마감 여부 확인
                            siteUrl={activity.siteUrl || 'https://naver.com'}
                          />
                        );
                      })}
                    </CardGrid>
                  </Section>
                )}
              </>
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
  padding: 40px 80px;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 42px;
`;

const ResultTitle = styled.h2`
  font-size: 40px;
  margin-bottom: 20px;
  margin-left: -52px;
`;

const Section = styled.div`
  padding: 20px 60px 40px 80px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 15px;
  margin-left: -80px;

  h3 {
    font-size: 20px;
    align-self: flex-start;
    margin-left: -43px;
    color: rgb(95, 95, 95);
  }
`;

const MoreBtn = styled.span`
  font-size: 14px;
  color: #111;
  cursor: pointer;
  margin-right: -95px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
  margin-left: -123px;
`;

const NoResult = styled.p`
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 40px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 40px;
`;
