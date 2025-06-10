import React, { useState } from 'react';
import styled from 'styled-components';
import Pagination from '../common/Pagination';
import bookmarkIcon from '../../assets/images/common/BookmarkFilledButton.png';
import { useNavigate } from 'react-router-dom';
import activitiesApi from '../../api/ActivitiesApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBookmarkedIssues, useToggleIssueBookmark } from '../../query/useIssues';
import { formatDate } from '../../utils/formatDate';

// 쿼리 키 상수 정의
const QUERY_KEYS = {
  ACTIVITIES: 'activities',
  BOOKMARKED_ACTIVITIES: 'bookmarkedActivities',
  BOOKMARKED_ISSUES: 'bookmarkedIssues'
};

export default function BookmarkList() {
  const [selectedType, setSelectedType] = useState('issue');
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 북마크된 이슈 조회
  const { data: bookmarkedIssues, isLoading: issuesLoading, error: issuesError } = useBookmarkedIssues(currentPage);

  // 북마크된 활동 조회
  const { data: bookmarkedActivities, isLoading: activitiesLoading, error: activitiesError } = useQuery({
    queryKey: [QUERY_KEYS.BOOKMARKED_ACTIVITIES, currentPage],
    queryFn: () => activitiesApi.getBookmarkedActivities(currentPage),
    enabled: selectedType === 'activity'
  });

  // 이슈 북마크 토글
  const toggleIssueBookmark = useToggleIssueBookmark();

  // 활동 북마크 토글
  const toggleActivityBookmark = useMutation({
    mutationFn: (activityId) => activitiesApi.toggleBookmark(activityId),
    onMutate: async (activityId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.BOOKMARKED_ACTIVITIES] });
      const previousData = queryClient.getQueryData([QUERY_KEYS.BOOKMARKED_ACTIVITIES, currentPage]);

      queryClient.setQueryData([QUERY_KEYS.BOOKMARKED_ACTIVITIES, currentPage], (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.filter(activity => activity.activityId !== activityId),
          totalElements: old.totalElements - 1
        };
      });

      return { previousData };
    },
    onError: (err, activityId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEYS.BOOKMARKED_ACTIVITIES, currentPage], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKMARKED_ACTIVITIES] });
    }
  });

  const handleIssueClick = (issue) => {
    navigate(`/global-issue/${issue.id}`, {
      state: {
        label: issue.category,
        title: issue.title
      }
    });
  };

  const handleActivityClick = (activity) => {
    const url = activity.siteUrl;
    if (url) {
      try {
        new URL(url);
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('잘못된 URL입니다:', url);
        alert('올바르지 않은 링크입니다.');
      }
    } else {
      alert('해당 활동의 링크 정보가 없습니다.');
    }
  };

  const handleBookmarkToggle = (e, id, type) => {
    e.stopPropagation();
    if (type === 'issue') {
      toggleIssueBookmark.mutate(id);
    } else {
      toggleActivityBookmark.mutate(id);
    }
  };

  const isLoading = selectedType === 'issue' ? issuesLoading : activitiesLoading;
  const error = selectedType === 'issue' ? issuesError : activitiesError;
  const data = selectedType === 'issue' ? bookmarkedIssues : bookmarkedActivities;

  return (
    <Wrapper>
      <CenteredToggleRow>
        <TabButton
          active={selectedType === 'issue'}
          onClick={() => setSelectedType('issue')}
        >
          글로벌 이슈
        </TabButton>
        <TabButton
          active={selectedType === 'activity'}
          onClick={() => setSelectedType('activity')}
        >
          활동
        </TabButton>
      </CenteredToggleRow>

      {isLoading ? (
        <LoadingMessage>로딩 중...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>데이터를 불러오는데 실패했습니다.</ErrorMessage>
      ) : data?.content.length === 0 ? (
        <EmptyMessage>북마크한 {selectedType === 'issue' ? '이슈' : '활동'}가 없습니다.</EmptyMessage>
      ) : (
        <>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>제목</th>
                  <th>카테고리</th>
                  {selectedType === 'activity' && <th>마감 날짜</th>}
                  {selectedType === 'issue' && <th>날짜</th>}
                  <th>북마크</th>
                </tr>
              </thead>
              <tbody>
                {selectedType === 'issue' ? (
                  data?.content.map((issue, idx) => (
                    <tr key={issue.id} onClick={() => handleIssueClick(issue)}>
                      <td>{data.pageable.offset + idx + 1}</td>
                      <td>{issue.title}</td>
                      <td>
                        <CategoryContainer>
                          <ActivityTag>{issue.category}</ActivityTag>
                        </CategoryContainer>
                      </td>
                      <td>{formatDate(issue.date)}</td>
                      <td>
                        <BookmarkIcon 
                          src={bookmarkIcon} 
                          alt="bookmark"
                          onClick={(e) => handleBookmarkToggle(e, issue.id, 'issue')}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  data?.content.map((activity, idx) => (
                    <tr key={activity.activityId} onClick={() => handleActivityClick(activity)}>
                      <td>{data.pageable.offset + idx + 1}</td>
                      <td>{activity.name}</td>
                      <td>
                        <CategoryContainer>
                          <ActivityTag>#{activity.keyword}</ActivityTag>
                          <ActivityTag>#{activity.activityType}</ActivityTag>
                        </CategoryContainer>
                      </td>
                      <td>{formatDate(activity.endDate)}</td>
                      <td>
                        <BookmarkIcon 
                          src={bookmarkIcon} 
                          alt="bookmark"
                          onClick={(e) => handleBookmarkToggle(e, activity.activityId, 'activity')}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableContainer>

          <PaginationWrapper>
            <Pagination
              currentPage={currentPage + 1}
              totalPages={data?.totalPages || 0}
              goToPage={(page) => setCurrentPage(page - 1)}
            />
          </PaginationWrapper>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CenteredToggleRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 150px;
  margin-bottom: 30px;
`;

const TabButton = styled.button`
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  background: ${({ active }) => (active ? '#235ba9' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const TableContainer = styled.div`
  width: 900px;
  max-width: 100%;
  margin: 0 auto;
  border-top: 2px solid #235ba9;
  border-bottom: 2px solid #235ba9;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th, td {
    padding: 12px 16px;
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border-top: 1px solid #d9e5f6;
  }

  th {
    background-color: #f5f9ff;
    color: #000;
    font-weight: 500;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 15px;
  }

  /* 컬럼별 너비 분배 */
  th:nth-child(1), td:nth-child(1) { width: 10%; }
  th:nth-child(2), td:nth-child(2) { width: 45%; }
  th:nth-child(3), td:nth-child(3) { width: 20%; }
  th:nth-child(4), td:nth-child(4) { width: 15%; }
  th:nth-child(5), td:nth-child(5) { width: 10%; }

  tr {
    transition: background-color 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: #f0f5ff;
    }
  }

  tr:nth-child(even) {
    background-color: #f7faff;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ActivityTag = styled.span`
  color: #235ba9;
  font-weight: 500;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 12px;
  display: inline-block;
`;

const EmptyMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #888;
  font-size: 15px;
`;

const BookmarkIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LoadingMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #888;
  font-size: 15px;
`;

const ErrorMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #ff4d4f;
  font-size: 15px;
`;
