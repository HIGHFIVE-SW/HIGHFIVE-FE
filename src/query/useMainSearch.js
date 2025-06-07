// hooks/useIssueSearch.js
import { useQuery } from '@tanstack/react-query';
import { searchIssues } from '../api/IssueSearch';

export const useIssueSearch = (keyword, page = 0, enabled = false) => {
  return useQuery({
    queryKey: ['issues', 'search', keyword, page],
    queryFn: () => searchIssues({ keyword, page }),
    enabled: enabled && keyword?.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};
