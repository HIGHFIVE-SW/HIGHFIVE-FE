import api from './axiosInstance';

// 키워드 및 타입 매핑
const KEYWORD_MAP = {
  '환경': 'Environment',
  '사람과사회': 'PeopleAndSociety',
  '경제': 'Economy',
  '기술': 'Technology'
};

const ACTIVITY_TYPE_MAP = {
  '봉사활동': 'VOLUNTEER',
  '공모전': 'CONTEST',
  '서포터즈': 'SUPPORTERS',
  '인턴십': 'INTERNSHIP'
};

const REVERSE_KEYWORD_MAP = {
  'Environment': '환경',
  'PeopleAndSociety': '사람과사회',
  'Economy': '경제',
  'Technology': '기술'
};

const REVERSE_TYPE_MAP = {
  'VOLUNTEER': '봉사활동',
  'CONTEST': '공모전',
  'SUPPORTERS': '서포터즈',
  'INTERNSHIP': '인턴십'
};

class ActivitiesApi {
  // 전체/필터 활동 목록 조회 (기존)
  async getActivities(params = {}) {
    try {
      const { page = 0, fieldFilter, typeFilter } = params;
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());

      // 키워드 필터 추가
      if (fieldFilter && fieldFilter !== '전체') {
        const mappedKeyword = KEYWORD_MAP[fieldFilter];
        if (mappedKeyword) {
          queryParams.append('keyword', mappedKeyword);
        }
      }

      // 활동 타입 필터 추가 (쿼리 방식)
      if (typeFilter && typeFilter !== '전체') {
        const mappedType = ACTIVITY_TYPE_MAP[typeFilter];
        if (mappedType) {
          queryParams.append('activityType', mappedType);
        }
      }

      const response = await api.get(`/activities?${queryParams.toString()}`);
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || 'API 요청이 실패했습니다.');
      }

      const result = response.data.result;
      const transformedContent = result.content.map(this.transformActivity);
      return {
        ...result,
        content: transformedContent
      };
    } catch (error) {
      console.error('활동 목록 조회 실패:', error);
      throw this.handleApiError(error);
    }
  }

  // 활동 타입별 조회 (RESTful 방식)
  async getActivitiesByType({ activityType, page = 0 }) {
    try {
      const response = await api.get(`/activities/type/${activityType}?page=${page}`);
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || 'API 요청이 실패했습니다.');
      }
      const result = response.data.result;
      const transformedContent = result.content.map(this.transformActivity);
      return {
        ...result,
        content: transformedContent
      };
    } catch (error) {
      console.error('특정 종류 활동글 조회 실패:', error);
      throw this.handleApiError(error);
    }
  }

  // 특정 키워드 활동글 조회 (RESTful 방식)
  async getActivitiesByKeyword({ keyword, page = 0 }) {
    try {
      const response = await api.get(`/activities/keyword/${keyword}?page=${page}`);
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || 'API 요청이 실패했습니다.');
      }
      const result = response.data.result;
      const transformedContent = result.content.map(this.transformActivity);
      return {
        ...result,
        content: transformedContent
      };
    } catch (error) {
      console.error('특정 키워드 활동글 조회 실패:', error);
      throw this.handleApiError(error);
    }
  }

  // 단일 활동 조회
  async getActivity(activityId) {
    try {
      const response = await api.get(`/activities/${activityId}`);
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || '활동 정보를 불러올 수 없습니다.');
      }
      return this.transformActivity(response.data.result);
    } catch (error) {
      console.error('활동 조회 실패:', error);
      throw this.handleApiError(error);
    }
  }

  // 북마크 토글
  async toggleBookmark(activityId) {
    try {
      const response = await api.post(`/activities/${activityId}/bookmark`);
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || '북마크 처리에 실패했습니다.');
      }
      return response.data.result;
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      throw this.handleApiError(error);
    }
  }

  // 활동 데이터 변환
  transformActivity = (activity) => {
    const koreanKeyword = REVERSE_KEYWORD_MAP[activity.keyword] || activity.keyword;
    const koreanType = REVERSE_TYPE_MAP[activity.activityType] || activity.activityType;
    const formatDate = (dateString) => {
      if (!dateString) return '';
      return dateString.split('T')[0].replace(/-/g, '.');
    };
    const now = new Date();
    const endDate = new Date(activity.endDate);
    const isClosed = endDate < now;

    return {
      id: activity.activityId,
      activityId: activity.activityId,
      title: activity.name,
      name: activity.name,
      tags: [`#${koreanKeyword}`, `#${koreanType}`],
      keyword: koreanKeyword,
      activityType: koreanType,
      date: `${formatDate(activity.startDate)} ~ ${formatDate(activity.endDate)}`,
      startDate: activity.startDate,
      endDate: activity.endDate,
      image: activity.imageUrl,
      imageUrl: activity.imageUrl,
      siteUrl: activity.siteUrl,
      bookmarked: activity.bookmarked,
      isClosed
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

const activitiesApi = new ActivitiesApi();
export default activitiesApi;
