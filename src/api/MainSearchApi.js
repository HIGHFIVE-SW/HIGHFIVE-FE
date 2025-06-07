import axiosInstance from './axiosInstance';

const KEYWORD_MAP = {
  '환경': 'Environment',
  '사람과 사회': 'PeopleAndSociety',
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
  'PeopleAndSociety': '사람과 사회',
  'Economy': '경제',
  'Technology': '기술'
};

const REVERSE_TYPE_MAP = {
  'VOLUNTEER': '봉사활동',
  'CONTEST': '공모전',
  'SUPPORTERS': '서포터즈',
  'INTERNSHIP': '인턴십'
};

export const searchIssues = async ({ keyword, page = 0, size = 4 }) => {
  const response = await axiosInstance.get('/issues/search', {
    params: {
      keyword,
      page,
      size
    }
  });
  
  if (response.data.isSuccess) {
    response.data.result.content = response.data.result.content.map(issue => ({
      ...issue,
      keyword: REVERSE_KEYWORD_MAP[issue.keyword] || issue.keyword
    }));
  }
  
  return response.data;
};

export const searchAllIssues = async ({ keyword, page = 0, size = 12 }) => {
  const response = await axiosInstance.get('/issues/search', {
    params: {
      keyword,
      page,
      size
    }
  });
  
  if (response.data.isSuccess) {
    response.data.result.content = response.data.result.content.map(issue => ({
      ...issue,
      keyword: REVERSE_KEYWORD_MAP[issue.keyword] || issue.keyword
    }));
  }
  
  return response.data;
};

export const toggleBookmark = async (issueId) => {
  const response = await axiosInstance.post(`/issues/${issueId}/bookmark`);
  return response.data;
};

export const searchActivities = async ({ keyword, activityType, page = 0, size = 4 }) => {
  const response = await axiosInstance.get('/activities/search', {
    params: {
      keyword,
      page,
      size
    }
  });
  
  if (response.data.isSuccess) {
    response.data.result.content = response.data.result.content.map(activity => ({
      ...activity,
      keyword: REVERSE_KEYWORD_MAP[activity.keyword] || activity.keyword,
      activityType: REVERSE_TYPE_MAP[activity.activityType] || activity.activityType
    }));
  }
  
  return response.data;
};

export const searchAllActivities = async ({ keyword, activityType, page = 0, size = 12 }) => {
  const response = await axiosInstance.get('/activities/search', {
    params: {
      keyword,
      page,
      size
    }
  });
  
  if (response.data.isSuccess) {
    response.data.result.content = response.data.result.content.map(activity => ({
      ...activity,
      keyword: REVERSE_KEYWORD_MAP[activity.keyword] || activity.keyword,
      activityType: REVERSE_TYPE_MAP[activity.activityType] || activity.activityType
    }));
  }
  
  return response.data;
};