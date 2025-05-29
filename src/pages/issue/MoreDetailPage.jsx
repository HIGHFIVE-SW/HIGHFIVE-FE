import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import ActivityCard from '../../components/activity/ActivityCard';
import Pagination from '../../components/common/Pagination';
import usePagination from '../../hooks/usePagination';
import activityImage from '../../assets/images/activity/ic_ActivityImage.png';

// 정규화 함수 추가
function normalizeLabel(label) {
  if (!label) return '';
  return '#' + label.replace(/\s/g, '').replace('#', '');
}

export default function MoreDetailPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rawFilterTag = queryParams.get('query');
  const filterTag = normalizeLabel(rawFilterTag); // 정규화된 필터 태그

  const dummyActivities = [
    ...Array.from({ length: 15 }, (_, idx) => ({
      id: idx + 1,
      title: `제 ${idx + 1}회 한국 경제 논문 공모전`,
      tags: ['#경제', '#공모전'],
      date: '2025.04.15~2025.04.20',
      image: activityImage,
      bookmarked: false,
      isClosed: [5, 9, 14].includes(idx + 1),
    })),
    {
      id: 16,
      title: '기후위기 대응 환경 세미나',
      tags: ['#환경', '#공모전'],
      date: '2025.04.10~2025.04.20',
      image: activityImage,
      bookmarked: false,
      isClosed: false,
    },
    {
      id: 17,
      title: '에코 자원순환 캠페인',
      tags: ['#환경', '#봉사활동'],
      date: '2025.04.12~2025.04.22',
      image: activityImage,
      bookmarked: false,
      isClosed: false,
    },
    {
      id: 18,
      title: '지역사회 혁신 프로젝트',
      tags: ['#사람과사회', '#서포터즈'],
      date: '2025.04.14~2025.04.25',
      image: activityImage,
      bookmarked: false,
      isClosed: true,
    },
    {
      id: 19,
      title: '청소년 멘토링 봉사',
      tags: ['#사람과사회', '#봉사활동'],
      date: '2025.04.15~2025.04.30',
      image: activityImage,
      bookmarked: false,
      isClosed: false,
    },
    {
      id: 20,
      title: '그린리더 환경 인턴십',
      tags: ['#환경', '#인턴십'],
      date: '2025.04.16~2025.04.30',
      image: activityImage,
      bookmarked: false,
      isClosed: true,
    }
  ];

  const filteredActivities = dummyActivities.filter((activity) =>
    filterTag ? activity.tags.includes(filterTag) : true
  );

  const itemsPerPage = 12;
  const { currentPage, totalPages, currentData, goToPage } = usePagination(filteredActivities, itemsPerPage);

  return (
    <PageWrapper>
      <MainNav />
      <Content>
        <PageTitle>추천 활동</PageTitle>

        <CardGrid>
          {currentData.map((activity) => (
            <ActivityCard
              key={activity.id}
              title={activity.title}
              tags={activity.tags}
              date={activity.date}
              image={activity.image}
              bookmarked={activity.bookmarked}
              onToggle={() => {}}
              isClosed={activity.isClosed}
            />
          ))}
        </CardGrid>

        <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
      </Content>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  background-color: #fff;
  min-height: 100vh;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 32px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 40px;
`;
