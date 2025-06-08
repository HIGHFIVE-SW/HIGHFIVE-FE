import axiosInstance from './axiosInstance';

// 카테고리 매핑
export const CATEGORY_MAP = {
  '환경': 'Environment',
  '사람과 사회': 'PeopleAndSociety',
  '경제': 'Economy',
  '기술': 'Technology'
};

// 카테고리 매핑 (영문 -> 한국어)
export const REVERSE_CATEGORY_MAP = {
  'Environment': '환경',
  'PeopleAndSociety': '사람과 사회',
  'Economy': '경제',
  'Technology': '기술'
};

export const ACTIVITY_TYPE_MAP = {
  '공모전': 'CONTEST',
  '봉사활동': 'VOLUNTEER',
  '인턴십': 'INTERNSHIP',
  '서포터즈': 'SUPPORTERS'
};

export const ACTIVITY_PERIOD_MAP = {
  '하루': 'OneDay',
  '일주일': 'OneWeek',
  '1개월': 'OneMonth',
  '6개월 이내': 'WithinSixMonths',
  '6개월 이상': 'OverSixMonths'
};

export const createPost = async (postData) => {
  try {
    // imageUrls를 포함한 전체 데이터를 한 번에 전송
    const response = await axiosInstance.post('/posts', postData);
    
    if (response.data.isSuccess) {
      console.log('게시물과 이미지가 성공적으로 생성되었습니다.');
      return response.data.result;
    } else {
      throw new Error(response.data.message || '게시물 작성에 실패했습니다.');
    }
  } catch (error) {
    console.error('자유 게시판 작성 API 호출 실패:', error);
    throw error;
  }
};

// 후기 게시판 게시물 생성 (이미지 URL 개별 처리)
export const createReview = async (reviewData) => {
  try {
    // imageUrls 배열을 분리하여 처리
    const { imageUrls, ...restData } = reviewData;
    
    // 기본 리뷰 데이터 먼저 전송 (imageUrls 제외)
    const response = await axiosInstance.post('/reviews', restData);
    
    if (response.data.isSuccess) {
      const reviewId = response.data.result.id;
      
      // 이미지 URLs를 개별적으로 저장
      if (imageUrls && imageUrls.length > 0) {
        const imageUploadPromises = imageUrls.map(async (imageUrl) => {
          return await axiosInstance.post(`/reviews/${reviewId}/images`, {
            imageUrl: imageUrl
          });
        });
        
        // 모든 이미지 URL 저장 완료까지 대기
        await Promise.all(imageUploadPromises);
        console.log(`${imageUrls.length}개 이미지 URL이 개별적으로 저장되었습니다.`);
      }
      
      return response.data.result;
    } else {
      throw new Error(response.data.message || '리뷰 작성에 실패했습니다.');
    }
  } catch (error) {
    console.error('후기 게시판 작성 API 호출 실패:', error);
    throw error;
  }
};

// 개별 이미지 URL 추가 함수 (자유게시판용)
export const addImageToPost = async (postId, imageUrl) => {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/images`, {
      imageUrl: imageUrl
    });
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '이미지 추가에 실패했습니다.');
    }
  } catch (error) {
    console.error('게시물 이미지 추가 API 호출 실패:', error);
    throw error;
  }
};

// 개별 이미지 URL 추가 함수 (리뷰용)
export const addImageToReview = async (reviewId, imageUrl) => {
  try {
    const response = await axiosInstance.post(`/reviews/${reviewId}/images`, {
      imageUrl: imageUrl
    });
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '이미지 추가에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 이미지 추가 API 호출 실패:', error);
    throw error;
  }
};

// 에디터에서 이미지 URL 추출 함수
export const extractImageUrls = (htmlContent) => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const urls = [];
  let match;
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
};

// 자유 게시판 전체 게시물 조회
export const getPosts = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/posts', {
      params: {
        page,
        size
      }
    });
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '게시물 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('자유 게시판 조회 API 호출 실패:', error);
    throw error;
  }
};

// 자유 게시판 특정 게시물 조회
export const getPost = async (postId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('게시물 상세 조회 API 호출 실패:', error);
    throw error;
  }
};

// 게시물 수정 (API 스펙에 맞게 단순화)
export const updatePost = async (postId, postData) => {
  try {
    console.log('게시물 수정 요청:', { postId, postData });
    
    // API 스펙에 맞게 전체 데이터를 한 번에 전송
    const response = await axiosInstance.patch(`/posts/update/${postId}`, postData);
    
    console.log('게시물 수정 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(response.data.message || '게시물 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('게시물 수정 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};


// 리뷰 수정 - API 스펙에 맞게 전체 데이터 한 번에 전송
export const updateReview = async (reviewId, reviewData) => {
  try {
    console.log('리뷰 수정 요청:', { reviewId, reviewData });
    
    // API 스펙에 맞는 요청 데이터 구성
    const requestData = {
      title: reviewData.title,
      content: reviewData.content,
      awardImageUrl: reviewData.awardImageUrl || null,
      imageUrls: reviewData.imageUrls || []
    };
    
    console.log('전송할 데이터:', requestData);
    
    const response = await axiosInstance.patch(`/reviews/update/${reviewId}`, requestData);
    
    console.log('리뷰 수정 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(response.data.message || '리뷰 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 수정 API 호출 실패:', error);
    
    if (error.response) {
      console.error('서버 응답:', error.response.data);
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 게시물 삭제 - API 스펙에 맞게 PATCH 메서드 사용
export const deletePost = async (postId) => {
  try {
    const response = await axiosInstance.patch(`/posts/delete/${postId}`);
    
    if (response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(response.data.message || '게시물 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('게시물 삭제 API 호출 실패:', error);
    throw error;
  }
};


// 리뷰 게시판 게시물 삭제
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.patch(`/reviews/delete/${reviewId}`);
    
    if (response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(response.data.message || '리뷰 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 삭제 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 게시물 좋아요/취소
export const togglePostLike = async (postId) => {
  try {
    console.log('좋아요 토글 요청:', postId);
    
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    
    console.log('좋아요 토글 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '좋아요 처리에 실패했습니다.');
    }
  } catch (error) {
    console.error('좋아요 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 여러 이미지 업로드를 위한 presigned URL 발급
export const getMultiplePresignedUrls = async (imageNames) => {
  try {
    const response = await axiosInstance.post('/presignedurls/images', {
      imageNames: imageNames
    });

    if (response.data.isSuccess) {
      return response.data.result.PresignedUrls;
    } else {
      throw new Error(response.data.message || 'PresignedUrl 발급에 실패했습니다.');
    }
  } catch (error) {
    console.error('여러 PresignedUrl API 호출 실패:', error);
    throw error;
  }
};

// 여러 이미지를 S3에 업로드
export const uploadMultipleImages = async (files) => {
  try {
    // 파일명 생성
    const imageNames = files.map(file => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop();
      return `${timestamp}-${randomString}.${extension}`;
    });

    // Presigned URL들 가져오기
    const presignedUrls = await getMultiplePresignedUrls(imageNames);

    // 각 파일을 S3에 업로드
    const uploadPromises = files.map(async (file, index) => {
      const presignedUrl = presignedUrls[index];
      
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        }
      });

      if (!response.ok) {
        throw new Error(`파일 ${file.name} 업로드 실패: ${response.status}`);
      }

      // 업로드된 이미지 URL 반환 (쿼리 파라미터 제거)
      return presignedUrl.split('?')[0];
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;

  } catch (error) {
    console.error('여러 이미지 업로드 실패:', error);
    throw error;
  }
};

// 좋아요 순으로 게시물 조회
export const getPostsByLikes = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/posts/like', {
      params: {
        page: page,
        size: size
      }
    });
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '좋아요 순 게시물 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('좋아요 순 게시물 조회 API 호출 실패:', error);
    throw error;
  }
};

// 특정 게시물의 모든 댓글 조회
export const getComments = async (postId) => {
  try {
    const response = await axiosInstance.get(`/comments/${postId}`);
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '댓글 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('댓글 조회 API 호출 실패:', error);
    throw error;
  }
};

// 특정 게시물에 댓글 작성
export const postComment = async (postId, content) => {
  try {
    const response = await axiosInstance.post(`/comments/${postId}`, { content });
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '댓글 작성에 실패했습니다.');
    }
  } catch (error) {
    console.error('댓글 작성 API 호출 실패:', error);
    throw error;
  }
};

// 특정 댓글 수정
export const updateComment = async (commentId, content) => {
  try {
    const response = await axiosInstance.patch(`/comments/update/${commentId}`, { content });
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '댓글 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('댓글 수정 API 호출 실패:', error);
    throw error;
  }
};

// 특정 댓글 삭제
export const deleteComment = async (commentId) => {
  try {
    const response = await axiosInstance.patch(`/comments/delete/${commentId}`);
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '댓글 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('댓글 삭제 API 호출 실패:', error);
    throw error;
  }
};

// 단일 이미지 업로드를 위한 presigned URL 발급
export const getPresignedUrl = async (imageName) => {
  try {
    const response = await axiosInstance.post('/presignedurls/image', {
      imageName: imageName
    });

    if (response.data.isSuccess) {
      return response.data.result.presignedUrl;
    } else {
      throw new Error(response.data.message || 'PresignedUrl 발급에 실패했습니다.');
    }
  } catch (error) {
    console.error('PresignedUrl API 호출 실패:', error);
    throw error;
  }
};

// 단일 이미지를 S3에 업로드
export const uploadSingleImage = async (file) => {
  try {
    // 파일명 생성
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const imageName = `award-${timestamp}-${randomString}.${extension}`;

    // Presigned URL 가져오기
    const presignedUrl = await getPresignedUrl(imageName);

    // S3에 업로드
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      }
    });

    if (!response.ok) {
      throw new Error(`파일 업로드 실패: ${response.status}`);
    }

    // 업로드된 이미지 URL 반환 (쿼리 파라미터 제거)
    return presignedUrl.split('?')[0];

  } catch (error) {
    console.error('단일 이미지 업로드 실패:', error);
    throw error;
  }
};

// 기존 활동에 대한 리뷰 생성 (검색해서 찾은 경우)
export const createActivityReview = async (activityId, reviewData) => {
  try {
    console.log('활동 리뷰 생성 요청:', { activityId, reviewData });
    
    const requestData = {
      title: reviewData.title,
      activityPeriod: reviewData.activityPeriod,
      content: reviewData.content,
      awardImageUrl: reviewData.awardImageUrl || null,
      imageUrls: reviewData.imageUrls || []
    };

    console.log('전송할 데이터:', requestData);
    
    const response = await axiosInstance.post(`/reviews/${activityId}`, requestData);
    
    console.log('활동 리뷰 생성 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '리뷰 생성에 실패했습니다.');
    }
  } catch (error) {
    console.error('활동 리뷰 생성 실패:', error);
    if (error.response) {
      console.error('서버 응답:', error.response.data);
    }
    throw error;
  }
};

// 새로운 활동과 함께 리뷰 생성 (직접 입력한 경우)
export const createNewActivityReview = async (reviewData) => {
  try {
    console.log('새 활동 리뷰 생성 요청:', reviewData);
    
    // 필수 필드 검증
    if (!reviewData.title?.trim()) throw new Error('제목은 필수입니다.');
    if (!reviewData.keyword) throw new Error('키워드는 필수입니다.');
    if (!reviewData.activityType) throw new Error('활동 유형은 필수입니다.');
    if (!reviewData.activityPeriod) throw new Error('활동 기간은 필수입니다.');
    if (!reviewData.activityName?.trim()) throw new Error('활동 이름은 필수입니다.');
    if (!reviewData.content?.trim()) throw new Error('내용은 필수입니다.');

    const requestData = {
      title: reviewData.title.trim(),
      keyword: reviewData.keyword,
      activityType: reviewData.activityType,
      activityPeriod: reviewData.activityPeriod,
      activityEndDate: reviewData.activityEndDate || null,
      activityName: reviewData.activityName.trim(),
      content: reviewData.content.trim(),
      awardImageUrl: reviewData.awardImageUrl || null,
      imageUrls: reviewData.imageUrls || []
    };
    
    console.log('전송할 데이터:', requestData);
    
    const response = await axiosInstance.post('/reviews', requestData);
    
    console.log('새 활동 리뷰 생성 응답:', response.data);

    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '리뷰 생성에 실패했습니다.');
    }
  } catch (error) {
    console.error('새 활동 리뷰 생성 실패:', error);
    if (error.response) {
      console.error('서버 응답:', error.response.data);
      console.error('상태 코드:', error.response.status);
    }
    throw error;
  }
};

// 리뷰 게시판 조회
export const getReviews = async (page = 0, keyword = null, activityType = null, sort = 'RECENT') => {
  try {
    const params = {
      page,
      sort: sort.toUpperCase() // 대문자로 변환
    };

    if (keyword) params.keyword = keyword;
    if (activityType) params.activityType = activityType;

    console.log('리뷰 조회 API 요청 파라미터:', params);

    const response = await axiosInstance.get('/reviews', { params });
    
    if (response.data.isSuccess) {
      // 응답 데이터의 키워드를 한국어로 변환
      const result = response.data.result;
      result.content = result.content.map(review => ({
        ...review,
        keyword: REVERSE_CATEGORY_MAP[review.keyword] || review.keyword
      }));
      return result;
    } else {
      throw new Error(response.data.message || '리뷰 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 조회 API 호출 실패:', error);
    throw error;
  }
};

// 리뷰 게시판 특정 게시물 조회
export const getReview = async (reviewId) => {
  try {
    const response = await axiosInstance.get(`/reviews/${reviewId}`);
    
    if (response.data.isSuccess) {
      const result = response.data.result;
      console.log('API 응답 데이터:', result);
      
      // ocr_result, ocrResult, awardOcrResult 등 다양한 필드명을 ocrResult로 통일
      result.ocrResult = result.ocrResult ?? result.ocr_result ?? result.awardOcrResult ?? false;
      delete result.ocr_result;
      delete result.awardOcrResult;
      
      // 키워드를 한국어로 변환
      result.keyword = REVERSE_CATEGORY_MAP[result.keyword] || result.keyword;
      // 활동 유형을 한국어로 변환
      result.activityType = Object.entries(ACTIVITY_TYPE_MAP).find(([key, value]) => value === result.activityType)?.[0] || result.activityType;
      // 활동 기간을 한국어로 변환
      result.activityPeriod = Object.entries(ACTIVITY_PERIOD_MAP).find(([key, value]) => value === result.activityPeriod)?.[0] || result.activityPeriod;
      
      console.log('변환 후 데이터:', result);
      return result;
    } else {
      throw new Error(response.data.message || '리뷰 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 상세 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 후기 게시판 좋아요/취소
export const toggleReviewLike = async (reviewId) => {
  try {
    const response = await axiosInstance.post(`/reviews/${reviewId}/like`);
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '리뷰 좋아요 처리에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 좋아요 API 호출 실패:', error);
    throw error;
  }
};

// 특정 사용자의 리뷰 게시물 조회
export const getUserReviews = async (userId, page = 0) => {
  try {
    console.log('사용자 리뷰 조회 요청:', { userId, page });
    
    const response = await axiosInstance.get(`/profile/reviews/${userId}`, {
      params: { page }
    });
    
    console.log('사용자 리뷰 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '사용자 리뷰 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('사용자 리뷰 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 특정 사용자의 자유게시판 게시물 조회
export const getUserPosts = async (userId, page = 0) => {
  try {
    console.log('사용자 게시물 조회 요청:', { userId, page });
    
    const response = await axiosInstance.get(`/profile/posts/${userId}`, {
      params: { page }
    });
    
    console.log('사용자 게시물 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '사용자 게시물 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('사용자 게시물 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 내가 쓴 리뷰 게시물 조회 (본인 프로필용)
export const getMyReviews = async (page = 0) => {
  try {
    console.log('내 리뷰 조회 요청:', { page });
    
    const response = await axiosInstance.get('/profile/reviews/mine', {
      params: { page }
    });
    
    console.log('내 리뷰 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '내 리뷰 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('내 리뷰 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 내가 쓴 자유 게시판 게시물 조회 (본인 프로필용)
export const getMyPosts = async (page = 0) => {
  try {
    console.log('내 게시물 조회 요청:', { page });
    
    const response = await axiosInstance.get('/profile/posts/mine', {
      params: { page }
    });
    
    console.log('내 게시물 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '내 게시물 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('내 게시물 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 키워드별 내 활동 통계 조회
export const getMyKeywordStats = async () => {
  try {
    console.log('키워드별 활동 통계 조회 요청');
    
    const response = await axiosInstance.get('/profile/reviews/mine/keyword/count');
    
    console.log('키워드별 활동 통계 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '키워드별 활동 통계 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('키워드별 활동 통계 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 활동 종류별 내 활동 통계 조회
export const getMyActivityTypeStats = async () => {
  try {
    console.log('활동 종류별 통계 조회 요청');
    
    const response = await axiosInstance.get('/profile/reviews/mine/type/count');
    
    console.log('활동 종류별 통계 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '활동 종류별 통계 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('활동 종류별 통계 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 특정 사용자의 키워드별 통계 조회
export const getUserKeywordStats = async (userId) => {
  try {
    console.log('사용자 키워드별 활동 통계 조회 요청:', userId);
    
    const response = await axiosInstance.get(`/profile/reviews/${userId}/keyword/count`);
    
    console.log('사용자 키워드별 활동 통계 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '키워드별 통계 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('사용자 키워드별 통계 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 특정 사용자의 활동 종류별 통계 조회
export const getUserActivityTypeStats = async (userId) => {
  try {
    console.log('사용자 활동 종류별 통계 조회 요청:', userId);
    
    const response = await axiosInstance.get(`/profile/reviews/${userId}/type/count`);
    
    console.log('사용자 활동 종류별 통계 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '활동 종료별 통계 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('사용자 활동 종류별 통계 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 리뷰 게시판 검색
export const searchReviews = async (keyword, page = 0) => {
  try {
    console.log('리뷰 검색 요청:', { keyword, page });
    
    const response = await axiosInstance.get('/reviews/search', {
      params: {
        keyword,
        page
      }
    });
    
    console.log('리뷰 검색 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '리뷰 검색에 실패했습니다.');
    }
  } catch (error) {
    console.error('리뷰 검색 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 자유 게시판 검색
export const searchPosts = async (keyword, page = 0) => {
  try {
    console.log('게시물 검색 요청:', { keyword, page });
    
    const response = await axiosInstance.get('/posts/search', {
      params: {
        keyword,
        page
      }
    });
    
    console.log('게시물 검색 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '게시물 검색에 실패했습니다.');
    }
  } catch (error) {
    console.error('게시물 검색 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};
