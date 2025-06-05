// src/components/mypage/BookmarkList.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import usePagination from '../../hooks/usePagination';
import Pagination from '../common/Pagination';
import bookmarkIcon from '../../assets/images/common/BookmarkFilledButton.png';
import { useNavigate } from 'react-router-dom';
import activitiesApi from '../../api/ActivitiesApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 쿼리 키 상수 정의
const QUERY_KEYS = {
  ACTIVITIES: 'activities',
  BOOKMARKED_ACTIVITIES: 'bookmarkedActivities'
};


export default function BookmarkList() {
  const [selectedType, setSelectedType] = useState('issue');
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: bookmarkedActivities, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.BOOKMARKED_ACTIVITIES, currentPage],
    queryFn: () => activitiesApi.getBookmarkedActivities(currentPage),
    enabled: selectedType === 'activity'
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: (activityId) => activitiesApi.toggleBookmark(activityId),
    onMutate: async (activityId) => {
      // 진행 중인 모든 관련 쿼리 취소
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.BOOKMARKED_ACTIVITIES] });

      // 이전 데이터 저장
      const previousData = queryClient.getQueryData([QUERY_KEYS.BOOKMARKED_ACTIVITIES, currentPage]);

      // 낙관적 업데이트
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
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEYS.BOOKMARKED_ACTIVITIES, currentPage], context.previousData);
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACTIVITIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKMARKED_ACTIVITIES] });
    }
  });

  const handleTitleClick = (activity) => {
    if (selectedType === 'issue') {
      navigate('/global-issue-detail', {
        state: {
          label: `#${activity.keyword}`,
          title: activity.name,
        },
      });
    } else {
      navigate(`/more-detail?query=${encodeURIComponent(activity.keyword)}`);
    }
  };

  const handleBookmarkToggle = (e, activityId) => {
    e.stopPropagation();
    toggleBookmarkMutation.mutate(activityId);
  };

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

      {selectedType === 'activity' ? (
        isLoading ? (
          <LoadingMessage>로딩 중...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>데이터를 불러오는데 실패했습니다.</ErrorMessage>
        ) : bookmarkedActivities?.content.length === 0 ? (
          <EmptyMessage>북마크한 활동이 없습니다.</EmptyMessage>
        ) : (
          <>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>제목</th>
                    <th>카테고리</th>
                    <th>날짜</th>
                    <th>북마크</th>
                  </tr>
                </thead>
                <tbody>
                  {bookmarkedActivities?.content.map((activity, idx) => (
                    <tr key={activity.bookmarkId}>
                      <td>{bookmarkedActivities.pageable.offset + idx + 1}</td>
                      <td>
                        <TitleLink onClick={() => handleTitleClick(activity)}>
                          {activity.name}
                        </TitleLink>
                      </td>
                      <td>
                        <ActivityTag>#{activity.keyword}</ActivityTag>
                      </td>
                      <td>{new Date(activity.startDate).toLocaleDateString()}</td>
                      <td>
                        <BookmarkIcon 
                          src={bookmarkIcon} 
                          alt="bookmark"
                          onClick={(e) => handleBookmarkToggle(e, activity.activityId)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>

            <PaginationWrapper>
              <Pagination
                currentPage={currentPage + 1}
                totalPages={bookmarkedActivities?.totalPages || 0}
                goToPage={(page) => setCurrentPage(page - 1)}
              />
            </PaginationWrapper>
          </>
        )
      ) : (
        <EmptyMessage>글로벌 이슈 북마크는 준비 중입니다.</EmptyMessage>
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

// 테이블 컨테이너: 폭 고정, 가운데 정렬, 상·하 테두리
const TableContainer = styled.div`
  width: 900px;
  max-width: 100%;
  margin: 0 auto;
  border-top: 2px solid #235ba9;
  border-bottom: 2px solid #235ba9;
  overflow-x: auto;
`;

// 테이블: 고정 레이아웃, 셀 크기·간격 고정
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

  tr:nth-child(even) {
    background-color: #f7faff;
  }
`;

const TitleLink = styled.span`
  color: #000;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const CategoryTag = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: #34a853;
  background: #f6faff;
  border: 1px solid #34a853;
`;

const ActivityTag = styled.span`
  color: #235ba9;
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #888;
  font-size: 15px;
`;

const BookmarkIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const PaginationWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
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