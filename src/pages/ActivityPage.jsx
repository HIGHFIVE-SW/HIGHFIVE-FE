// pages/ActivityPage.js
import React from 'react';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import ActivityCard from '../components/activity/ActivityCard';
import Pagination from '../components/common/Pagination';
import CustomDropdown from '../components/common/CustomDropdown';
import { useActivityStore } from '../store/activityStore';
import { useActivities, useToggleBookmark } from '../query/useActivities';

const fieldOptions = ["전체", "경제", "환경", "사람과 사회", "기술"];
const typeOptions = ["전체", "공모전", "봉사활동", "인턴십", "서포터즈"];

export default function ActivityPage() {
  const {
    fieldFilter,
    typeFilter,
    currentPage,
    setFieldFilter,
    setTypeFilter,
    setCurrentPage
  } = useActivityStore();
  
  const { 
    data: activitiesData, 
    isLoading, 
    error,
    isError 
  } = useActivities();
  
  const toggleBookmarkMutation = useToggleBookmark();
  const queryClient = useQueryClient();

  const activities = activitiesData?.content || [];
  const totalPages = activitiesData?.totalPages || 0;

  const handleToggleBookmark = (activityId) => {
    toggleBookmarkMutation.mutate(activityId);
  };

  // 필터 변경 시 캐시 prefetch
  const handleFieldFilterChange = (newFilter) => {
    setFieldFilter(newFilter);
    
    // 새 필터로 데이터 prefetch
    queryClient.prefetchQuery({
      queryKey: ['activities', newFilter, typeFilter, 0],
    });
  };

  const handleTypeFilterChange = (newFilter) => {
    setTypeFilter(newFilter);
    
    // 새 필터로 데이터 prefetch
    queryClient.prefetchQuery({
      queryKey: ['activities', fieldFilter, newFilter, 0],
    });
  };

  return (
    <Wrapper>
      <MainNav />
      <HeaderSection>
        <Title>활동</Title>
        <Subtitle>나에게 맞는 활동을 찾아보자</Subtitle>
      </HeaderSection>

      <ContentSection>
        <FilterSection>
          <FilterBlock>
            <FilterLabel>관심 분야</FilterLabel>
            <CustomDropdown
              options={fieldOptions}
              selected={fieldFilter}
              onSelect={handleFieldFilterChange}
            />
          </FilterBlock>
          <FilterBlock>
            <FilterLabel>활동 유형</FilterLabel>
            <CustomDropdown
              options={typeOptions}
              selected={typeFilter}
              onSelect={handleTypeFilterChange}
            />
          </FilterBlock>
        </FilterSection>

        {isError && <ErrorMessage>{error?.message}</ErrorMessage>}
        
        {isLoading ? (
          <LoadingMessage>로딩 중...</LoadingMessage>
        ) : (
          <CardGrid>
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                tags={activity.tags}
                date={activity.date}
                image={activity.image}
                bookmarked={activity.bookmarked}
                onToggle={() => handleToggleBookmark(activity.id)}
                isClosed={activity.isClosed}
                siteUrl={activity.siteUrl || 'https://naver.com'}
              />
            ))}
            {Array.from({ length: 4 - (activities.length % 4) }).map((_, idx) => (
              <div
                key={`placeholder-${idx}`}
                style={{
                  width: '100%',
                  height: '0px',
                }}
              />
            ))}
          </CardGrid>
        )}
      </ContentSection>

      <Pagination
        currentPage={currentPage + 1}
        totalPages={totalPages}
        goToPage={(page) => setCurrentPage(page - 1)}
      />

      <Footer />
    </Wrapper>
  );
}

// 스타일 컴포넌트는 기존과 동일...


// 이하 스타일 컴포넌트는 기존과 동일
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

const Title = styled.h1`
  font-size: 44px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 24px;
  color: #656565;
  margin: 20px 0 0;
`;

const ContentSection = styled.div`
  padding: 40px 60px 40px 38px;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 40px;
  justify-content: flex-start;
  padding: 0 0 30px 0;
  flex-wrap: wrap;
  margin-left: 5px;
`;

const FilterBlock = styled.div`
  width: 120px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
  color: #666;
`;
