// hooks/useIssues.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import issuesApi from '../api/IssueApi';
import styled from 'styled-components';

// 쿼리 키 상수 정의
export const QUERY_KEYS = {
  ISSUES: 'issues',
  ISSUES_BY_KEYWORD: 'issuesByKeyword',
  BOOKMARKED_ISSUES: 'bookmarkedIssues',
  ISSUE_DETAIL: 'issueDetail'
};

// 이슈 목록 조회
export const useIssues = (page = 0) => {
  return useQuery({
    queryKey: ['issues', page],
    queryFn: async () => {
      console.log('현재 토큰:', localStorage.getItem('accessToken'));
      return await issuesApi.getIssues(page);
    },
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// 키워드별 이슈 목록 조회 수정
export const useIssuesByKeyword = (keyword, page = 0) => {
  return useQuery({
    queryKey: ['issues', 'keyword', keyword, page],
    queryFn: async () => {
      console.log('현재 토큰:', localStorage.getItem('accessToken'));
      return await issuesApi.getIssuesByKeyword({ keyword, page });
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// 이슈 북마크 토글
export const useToggleIssueBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId) => {
      console.log('현재 토큰:', localStorage.getItem('accessToken'));
      return await issuesApi.toggleIssueBookmark(issueId);
    },
    onSuccess: () => {
      // 캐시 무효화하여 이슈 목록 새로고침
      queryClient.invalidateQueries(['issues']);
      queryClient.invalidateQueries(['bookmarkedIssues']);
    },
  });
};

// 북마크된 이슈 목록 조회
export const useBookmarkedIssues = (page = 0) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKMARKED_ISSUES, page],
    queryFn: () => issuesApi.getBookmarkedIssues(page),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// 이슈 상세 조회
export const useIssueDetail = (issueId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ISSUE_DETAIL, issueId],
    queryFn: () => issuesApi.getIssueDetail(issueId),
    enabled: !!issueId,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

const RecommendCards = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
  overflow-x: auto;
`;

const Card = styled.div`
  width: 260px;
  height: 400px;
`;

const IssueImage = styled.img`
  width: 254px;
  height: 160px;
`;
