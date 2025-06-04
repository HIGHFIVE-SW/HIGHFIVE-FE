import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import ActivityCard from '../components/activity/ActivityCard';
import Pagination from '../components/common/Pagination';
import CustomDropdown from '../components/common/CustomDropdown';
import activitiesApi from '../api/ActivitiesApi';

const fieldOptions = ["전체", "경제", "환경", "사람과사회", "기술"];
const typeOptions = ["전체", "공모전", "봉사활동", "인턴십", "서포터즈"];

const ACTIVITY_TYPE_MAP = {
  '봉사활동': 'VOLUNTEER',
  '공모전': 'CONTEST',
  '서포터즈': 'SUPPORTERS',
  '인턴십': 'INTERNSHIP'
};

const KEYWORD_MAP = {
  '환경': 'Environment',
  '사람과사회': 'PeopleAndSociety',
  '경제': 'Economy',
  '기술': 'Technology'
};

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [fieldFilter, setFieldFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const fetchActivities = async (page) => {
  try {
    setLoading(true);
    setError(null);

    // 1. 관심 분야(키워드) 필터가 '전체'가 아니면 키워드 RESTful API 사용
    if (fieldFilter !== '전체') {
      const keyword = KEYWORD_MAP[fieldFilter];
      if (keyword) {
        const response = await activitiesApi.getActivitiesByKeyword({
          keyword,
          page
        });
        setActivities(response.content);
        setTotalPages(response.totalPages);
        setLoading(false);
        return;
      }
    }

    // 2. 활동 유형 필터가 '전체'가 아니면 타입 RESTful API 사용
    if (typeFilter !== '전체') {
      const activityType = ACTIVITY_TYPE_MAP[typeFilter];
      if (activityType) {
        const response = await activitiesApi.getActivitiesByType({
          activityType,
          page
        });
        setActivities(response.content);
        setTotalPages(response.totalPages);
        setLoading(false);
        return;
      }
    }

    // 3. 둘 다 '전체'면 기존 쿼리 API 사용
    const response = await activitiesApi.getActivities({
      page,
      fieldFilter,
      typeFilter
    });
    setActivities(response.content);
    setTotalPages(response.totalPages);
  } catch (err) {
    setError(err.message);
    console.error('활동 목록 조회 실패:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchActivities(currentPage);
    // eslint-disable-next-line
  }, [currentPage, fieldFilter, typeFilter]);

  const toggleBookmark = async (id) => {
    try {
      await activitiesApi.toggleBookmark(id);
      setActivities((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, bookmarked: !a.bookmarked } : a
        )
      );
    } catch (err) {
      console.error('북마크 토글 실패:', err);
    }
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
              onSelect={setFieldFilter}
            />
          </FilterBlock>
          <FilterBlock>
            <FilterLabel>활동 유형</FilterLabel>
            <CustomDropdown
              options={typeOptions}
              selected={typeFilter}
              onSelect={setTypeFilter}
            />
          </FilterBlock>
        </FilterSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {loading ? (
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
                onToggle={() => toggleBookmark(activity.id)}
                isClosed={activity.isClosed}
                siteUrl={activity.siteUrl}
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
