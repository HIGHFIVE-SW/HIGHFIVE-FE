import React, { useState } from 'react';
import styled from 'styled-components';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import ActivityCard from '../components/activity/ActivityCard';

import activityImage1 from '../assets/images/activity/ic_ActivityImage.png';

const dummyActivities = [
  { id: 1, title: '제 22회 한국 경제 논문 공모전', tags: ['#환경', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 2, title: '환경 공모전', tags: ['#환경', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 3, title: '환경 봉사활동', tags: ['#환경', '#봉사활동'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 4, title: '환경 봉사활동', tags: ['#환경', '#봉사활동'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 5, title: '사람과 사회 공모전', tags: ['#사람과사회', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 6, title: '사람과 사회 인턴십', tags: ['#사람과사회', '#인턴십'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 7, title: '경제 서포터즈', tags: ['#경제', '#서포터즈'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 8, title: '경제 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 9, title: '기술 봉사활동', tags: ['#기술', '#봉사활동'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 10, title: '기술 봉사활동', tags: ['#기술', '#봉사활동'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 11, title: '기술 공모전', tags: ['#기술', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 12, title: '경제 봉사활동', tags: ['#경제', '#봉사활동'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 13, title: '사람과 사회 봉사활동', tags: ['#사람과사회', '#봉사활동'], date: '2025.04.15~2025.04.20', image: activityImage1 },
  { id: 14, title: '환경 세미나 참가', tags: ['#환경', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage1 },
];

export default function ActivityPage() {
  const [bookmarked, setBookmarked] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fieldFilter, setFieldFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const itemsPerPage = 12;

  const toggleBookmark = (id) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const filtered = dummyActivities.filter((activity) => {
    const [fieldTag, typeTag] = activity.tags;
    const matchField = fieldFilter === '전체' || fieldTag === `#${fieldFilter}`;
    const matchType = typeFilter === '전체' || typeTag === `#${typeFilter}`;
    return matchField && matchType;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

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
            <SelectBox onChange={(e) => setFieldFilter(e.target.value)} value={fieldFilter}>
              <option>전체</option>
              <option>경제</option>
              <option>환경</option>
              <option>사람과사회</option>
              <option>기술</option>
            </SelectBox>
          </FilterBlock>
          <FilterBlock>
            <FilterLabel>활동 유형</FilterLabel>
            <SelectBox onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
              <option>전체</option>
              <option>공모전</option>
              <option>봉사활동</option>
              <option>인턴십</option>
              <option>서포터즈</option>
            </SelectBox>
          </FilterBlock>
        </FilterSection>

        <CardGrid>
            {paginated.map((activity) => (
                <ActivityCard
                key={activity.id}
                title={activity.title}
                tags={activity.tags.join(' ')}
                date={activity.date}
                image={activity.image}
                bookmarked={bookmarked.includes(activity.id)}
                onToggle={() => toggleBookmark(activity.id)}
                />         
            ))}
        {Array.from({ length: 4 - paginated.length }).map((_, index) => (
        <div key={`placeholder-${index}`} style={{ width: '405px' }} />
        ))}
        </CardGrid>
      </ContentSection>

      <Pagination>
        {Array.from({ length: totalPages }).map((_, i) => (
          <PageBtn
            key={i + 1}
            active={currentPage === i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PageBtn>
        ))}
        {currentPage < totalPages && (
          <NextBtn onClick={() => setCurrentPage((prev) => prev + 1)}>
            NEXT &gt;
          </NextBtn>
        )}
      </Pagination>

      <Footer />
    </Wrapper>
  );
}

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
  padding: 40px 80px;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 40px;
  justify-content: flex-start;
  padding: 0 0 60px 0;
  flex-wrap: wrap;
  margin-left: -40px;
`;

const FilterBlock = styled.div`
  width: 128px;
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
`;

const SelectBox = styled.select`
  width: 128px;
  height: 36px;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 1600px;
  margin: 0 auto;
  justify-content: center;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 40px 0 60px;
`;

const PageBtn = styled.button`
  background-color: ${(props) =>
    props.active ? '#F6FAFF' : 'transparent'};
  color: ${(props) => (props.active ? '#1D4ED8' : '#000')};
  border: none;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const NextBtn = styled.button`
  background: none;
  border: none;
  color: #000;
  cursor: pointer; 
`;
