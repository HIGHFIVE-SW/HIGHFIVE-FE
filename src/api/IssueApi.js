// api/IssuesApi.js
import api from './axiosInstance';

const KEYWORD_MAP = {
  '환경': 'Environment',
  '사람과 사회': 'PeopleAndSociety',
  '경제': 'Economy',
  '기술': 'Technology'
};

const REVERSE_KEYWORD_MAP = {
  'Environment': '환경',
  'PeopleAndSociety': '사람과 사회',
  'Economy': '경제', 
  'Technology': '기술'
};

class IssuesApi {
  // 전체 이슈 조회
  async getIssues(page = 0) {
    try {
      const response = await api.get(`/issues?page=${page}`);
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || 'API 요청이 실패했습니다.');
      }

      const result = response.data.result;
      const transformedContent = result.content.map(this.transformIssue);
      
      return {
        ...result,
        content: transformedContent
      };
    } catch (error) {
      console.error('이슈 목록 조회 실패:', error);
      throw this.handleApiError(error);
    }
  }

  async getIssuesByKeyword({ keyword, page = 0 }) {
    try {
      // keyword가 객체인 경우 처리
      const keywordValue = typeof keyword === 'object' ? keyword.value || keyword.keyword : keyword;
      const mappedKeyword = KEYWORD_MAP[keywordValue] || keywordValue;
      
      const response = await api.get(`/issues/keyword/${mappedKeyword}?page=${page}`);
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || '키워드별 이슈 조회에 실패했습니다.');
      }

      const result = response.data.result;
      const transformedContent = result.content.map(this.transformIssue);
      
      return {
        ...result,
        content: transformedContent
      };
    } catch (error) {
      console.error('키워드별 이슈 조회 실패:', error);
      throw this.handleApiError(error);
    }
  }

  // 특정 이슈 상세 조회
async getIssueDetail(issueId) {
  try {
    const response = await api.get(`/issues/${issueId}`);
    if (!response.data.isSuccess) {
      throw new Error(response.data.message || '이슈 상세 조회에 실패했습니다.');
    }

    const issue = response.data.result;
    const koreanKeyword = REVERSE_KEYWORD_MAP[issue.keyword] || issue.keyword;
    
    return {
      id: issue.id,
      title: issue.title,
      content: issue.content,
      issueDate: issue.issueDate,
      siteUrl: issue.siteUrl,
      imageUrl: issue.imageUrl || '/assets/images/main/ic_NoImage.png',
      keyword: koreanKeyword,
      category: `${koreanKeyword}`,
      bookmarked: issue.bookmarked || false
    };
  } catch (error) {
    console.error('이슈 상세 조회 실패:', error);
    throw this.handleApiError(error);
  }
}

  // 이슈 북마크 토글
  async toggleIssueBookmark(issueId) {
    try {
      const response = await api.post(`/issues/${issueId}/bookmark`);
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || '북마크 처리에 실패했습니다.');
      }
      return response.data.result;
    } catch (error) {
      console.error('이슈 북마크 토글 실패:', error);
      throw this.handleApiError(error);
    }
  }

// 북마크된 이슈 목록 조회
async getBookmarkedIssues(page = 0) {
  try {
    const response = await api.get(`/profile/issues/bookmark?page=${page}`);
    if (response.data.isSuccess) {
      return {
        ...response.data.result,
        content: response.data.result.content.map(issue => {
          const koreanKeyword = REVERSE_KEYWORD_MAP[issue.keyword] || issue.keyword;
          
          return {
            id: issue.issueId,
            title: issue.title,
            category: `#${koreanKeyword}`,
            date: issue.issueDate,
            bookmarkId: issue.bookmarkId
          };
        })
      };
    }
    throw new Error(response.data.message || '북마크한 이슈 조회에 실패했습니다.');
  } catch (error) {
    console.error('북마크한 이슈 조회 에러:', error);
    throw error;
  }
}

  // 북마크된 이슈 전용 변환 메서드 추가
  transformBookmarkedIssue = (bookmark) => {
    const koreanKeyword = REVERSE_KEYWORD_MAP[bookmark.keyword] || bookmark.keyword;
    
    return {
      bookmarkId: bookmark.bookmarkId,
      id: bookmark.issueId,
      title: bookmark.title,
      category: `#${koreanKeyword}`,
      keyword: koreanKeyword,
      issueDate: bookmark.issueDate,
      bookmarked: true
    };
  };
  transformIssue = (issue) => {
    const koreanKeyword = REVERSE_KEYWORD_MAP[issue.keyword] || issue.keyword;
    
    return {
      id: issue.id,
      title: issue.title,
      category: `#${koreanKeyword}`,
      keyword: koreanKeyword,
      thumbnailUrl: issue.imageUrl || '/assets/images/main/ic_NoImage.png',
      bookmarked: issue.bookmarked || false
    };
  };

  handleApiError = (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      switch (status) {
        case 400: return new Error('잘못된 요청입니다.');
        case 401: return new Error('로그인이 필요합니다.');
        case 403: return new Error('접근 권한이 없습니다.');
        case 404: return new Error('요청한 데이터를 찾을 수 없습니다.');
        case 500: return new Error('서버 오류가 발생했습니다.');
        default: return new Error(message);
      }
    } else if (error.request) {
      return new Error('네트워크 연결을 확인해주세요.');
    } else {
      return new Error(error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };
}



const issuesApi = new IssuesApi();
export default issuesApi;
