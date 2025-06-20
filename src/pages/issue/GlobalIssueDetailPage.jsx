import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import linkIcon from '../../assets/images/issue/ic_Link.png';
import BookmarkButtonIcon from '../../assets/images/common/BookmarkButton.png';
import BookmarkFilledIcon from '../../assets/images/common/BookmarkFilledButton.png';
import { useIssueDetail, useToggleIssueBookmark } from '../../query/useIssues';
import { useActivitiesByKeywordLimited, useToggleBookmark } from '../../query/useActivities';
import ActivityCard from '../../components/activity/SmallActivityCard';
import { formatDate } from '../../utils/formatDate';

export default function GlobalIssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 쿼리 클라이언트 및 훅들
  const queryClient = useQueryClient();
  const toggleBookmarkMutation = useToggleBookmark();
  
  // 이슈 데이터 조회
  const { data: issue, isLoading, error } = useIssueDetail(id);
  const toggleIssueBookmark = useToggleIssueBookmark();

  // 추천 활동 조회
  const { 
    data: recommendedActivities, 
    isLoading: activitiesLoading,
    error: activitiesError,
    isError: isActivitiesError
  } = useActivitiesByKeywordLimited(
    issue?.keyword,
    {
      enabled: !!issue?.keyword
    }
  );

  // 이슈 북마크 토글
  const handleIssueBookmarkToggle = () => {
    toggleIssueBookmark.mutate(id);
  };

  // 활동 북마크 토글
const handleActivityBookmarkToggle = async (activityId) => {
  // 즉시 UI 업데이트 (optimistic)
  queryClient.setQueryData(
    ['activitiesByKeywordLimited', issue?.keyword], 
    (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      
      return oldData.map((activity) =>
        (activity.id === activityId || activity.activityId === activityId)
          ? { ...activity, bookmarked: !activity.bookmarked }
          : activity
      );
    }
  );

  // 서버 요청
  try {
    await toggleBookmarkMutation.mutateAsync(activityId);
  } catch (error) {
    // 실패 시 롤백
    queryClient.setQueryData(
      ['activitiesByKeywordLimited', issue?.keyword], 
      (oldData) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;
        
        return oldData.map((activity) =>
          (activity.id === activityId || activity.activityId === activityId)
            ? { ...activity, bookmarked: !activity.bookmarked } // 다시 원래대로
            : activity
        );
      }
    );
    console.error('북마크 토글 실패:', error);
  }
};

  if (isLoading) {
    return (
      <PageWrapper>
        <MainNav />
        <LoadingContainer>
          <p>이슈를 불러오는 중...</p>
        </LoadingContainer>
        <Footer />
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <MainNav />
        <ErrorContainer>
          <p>이슈를 불러오는데 실패했습니다: {error.message}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </ErrorContainer>
        <Footer />
      </PageWrapper>
    );
  }

  if (!issue) {
    return (
      <PageWrapper>
        <MainNav />
        <ErrorContainer>
          <p>이슈를 찾을 수 없습니다.</p>
          <button onClick={() => navigate('/global-issue')}>이슈 목록으로 돌아가기</button>
        </ErrorContainer>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <MainNav />
      <ContentWrapper>
        <HeaderWrapper>
          <div>
            <LabelWrapper>
              <Label>{issue.category}</Label>
            </LabelWrapper>
            <Title>{issue.title}</Title>
            <DateText>{formatDate(issue.issueDate)}</DateText>
          </div>
          <BookmarkIcon
            src={issue.bookmarked ? BookmarkFilledIcon : BookmarkButtonIcon}
            alt="북마크"
            onClick={handleIssueBookmarkToggle}
          />
        </HeaderWrapper>
        
        <Divider />
        <MainImage src={issue.imageUrl} alt="이슈 이미지" />
        <SummarySection>
          <SummaryTitle>내용 요약</SummaryTitle>
          <SummaryText>{issue.content}</SummaryText>
        </SummarySection>
        {issue.siteUrl && (
          <SummarySection>
            <OriginalLink href={issue.siteUrl} target="_blank" rel="noopener noreferrer">
              <LinkImage src={linkIcon} alt="링크 아이콘" />
              관심이 있다면 원본 기사 확인하기
            </OriginalLink>
          </SummarySection>
        )}
      </ContentWrapper>

      <RecommendWrapper>
        <Divider />
        <RecommendCardsHeader>
          <RecommendTitle>추천 활동</RecommendTitle>
        </RecommendCardsHeader>
        
        {isActivitiesError && (
          <ErrorMessage>{activitiesError?.message}</ErrorMessage>
        )}
        
        <RecommendCards>
          {activitiesLoading ? (
            <LoadingText>추천 활동을 불러오는 중...</LoadingText>
          ) : recommendedActivities && recommendedActivities.length > 0 ? (
            recommendedActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                tags={activity.tags}
                date={activity.date}
                image={activity.image}
                bookmarked={activity.bookmarked}
                onToggle={() => handleActivityBookmarkToggle(activity.id)}
                isClosed={activity.isClosed}
                siteUrl={activity.siteUrl || 'https://naver.com'}
              />
            ))
          ) : (
            <NoActivitiesText>관련 활동이 없습니다.</NoActivitiesText>
          )}
        </RecommendCards>
      </RecommendWrapper>
      <Footer />
    </PageWrapper>
  );
}

// 스타일 컴포넌트들
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const RecommendWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.div`
  color: #656565;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const DateText = styled.p`
  font-size: 17px;
  color: #888;
  margin-bottom: 20px;
`;

const BookmarkIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
  cursor: pointer;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin-bottom: 30px;
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 30px;
`;

const SummarySection = styled.div`
  background-color: #f6faff;
  padding: 50px;
  border-radius: 10px;
  margin-bottom: 60px;
`;

const SummaryTitle = styled.h2`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
`;

const SummaryText = styled.p`
  font-size: 22px;
  color: #333;
  line-height: 2;
  margin-bottom: 12px;
  text-align: center;
`;

const OriginalLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #235BA9;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #FFCD4A;
  }

  &:visited {
    color: #235BA9;
  }
`;

const LinkImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 8px;
`;

const RecommendCardsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0 20px;
`;

const RecommendTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const RecommendCards = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
  overflow-x: auto;
`;

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

const LoadingText = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
  color: #666;
`;

const NoActivitiesText = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
`;
