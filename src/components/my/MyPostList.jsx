// src/components/mypage/MyPostsList.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Pagination from '../common/Pagination';
import { useUserReviews, useUserPosts, useMyReviews, useMyPosts } from '../../query/usePost';

const MyPostsList = ({ userId }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  
  // userId가 없으면 내 마이페이지 (내 게시물 조회)
  // userId가 있으면 다른 사용자 페이지 (사용자별 리뷰와 게시물 조회)
  const isMyPage = !userId;
  
  // API 페이지는 0부터 시작하므로 currentPage - 1
  // 내 리뷰 조회 (내 마이페이지에서만 실행)
  const { 
    data: myReviewsData, 
    isLoading: myReviewsLoading, 
    isError: myReviewsError, 
    error: myReviewsErrorMessage 
  } = useMyReviews(currentPage - 1, { enabled: isMyPage });
  
  // 사용자별 리뷰 조회 (다른 사용자 페이지에서만 실행)
  const { 
    data: userReviewsData, 
    isLoading: userReviewsLoading, 
    isError: userReviewsError, 
    error: userReviewsErrorMessage 
  } = useUserReviews(userId, currentPage - 1, { enabled: !isMyPage && !!userId });
  
  // 사용자별 자유게시판 게시물 조회 (다른 사용자 페이지에서만 실행)
  const { 
    data: userPostsData, 
    isLoading: userPostsLoading, 
    isError: userPostsError, 
    error: userPostsErrorMessage 
  } = useUserPosts(userId, currentPage - 1, { enabled: !isMyPage && !!userId });
  
  // 내 자유게시판 게시물 조회 (내 마이페이지에서만 실행)
  const { 
    data: postsData, 
    isLoading: postsLoading, 
    isError: postsError, 
    error: postsErrorMessage 
  } = useMyPosts(currentPage - 1, { enabled: isMyPage });
  
  // 데이터 통합 처리
  let posts = [];
  let isLoading = false;
  let isError = false;
  let error = null;
  let totalPages = 0;
  
  if (isMyPage) {
    // 내 마이페이지: 리뷰와 게시물 데이터를 합치기
    const reviewPosts = (myReviewsData?.content || []).map(post => ({
      ...post,
      boardType: '후기 게시판'
    }));
    
    const freePosts = (postsData?.content || []).map(post => ({
      ...post,
      boardType: '자유 게시판'  
    }));
    
    // 두 데이터를 합치고 날짜순으로 정렬
    posts = [...reviewPosts, ...freePosts].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    
    isLoading = myReviewsLoading || postsLoading;
    isError = myReviewsError || postsError;
    error = myReviewsErrorMessage || postsErrorMessage;
    
    // 페이지네이션을 위해 수동으로 페이지 처리 (간단히 전체 데이터 기준)
    totalPages = Math.max(myReviewsData?.totalPages || 0, postsData?.totalPages || 0);
  } else {
    // 다른 사용자 페이지: 리뷰와 자유게시판 게시물 통합
    const userReviewPosts = (userReviewsData?.content || []).map(post => ({
      ...post,
      boardType: '후기 게시판'
    }));
    
    const userFreePosts = (userPostsData?.content || []).map(post => ({
      ...post,
      boardType: '자유 게시판'  
    }));
    
    // 두 데이터를 합치고 날짜순으로 정렬
    posts = [...userReviewPosts, ...userFreePosts].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    
    isLoading = userReviewsLoading || userPostsLoading;
    isError = userReviewsError || userPostsError;
    error = userReviewsErrorMessage || userPostsErrorMessage;
    totalPages = Math.max(userReviewsData?.totalPages || 0, userPostsData?.totalPages || 0);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePostClick = (post) => {
    const path = post.boardType === '후기 게시판' 
      ? `/board/review/${post.id}`
      : `/board/detail/${post.id}`;
    navigate(path);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '');
  };

  if (isLoading) {
    return (
      <Wrapper>
        <LoadingMessage>게시물을 불러오는 중...</LoadingMessage>
      </Wrapper>
    );
  }

  if (isError) {
    return (
      <Wrapper>
        <ErrorMessage>게시물을 불러오는데 실패했습니다: {error?.message}</ErrorMessage>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {posts.length === 0 ? (
        <EmptyMessage>
          {isMyPage 
            ? '작성한 게시물이 없습니다.'
            : '작성한 리뷰가 없습니다.'
          }
        </EmptyMessage>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>게시판</th>
                <th>제목</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <tr key={`${post.boardType}-${post.id}`}>
                  <td>{(currentPage - 1) * 10 + idx + 1}</td>
                  <td>
                    <BoardTag board={post.boardType}>
                      {post.boardType}
                    </BoardTag>
                  </td>
                  <td>
                    <PostTitle onClick={() => handlePostClick(post)}>
                      {post.title}
                    </PostTitle>
                  </td>
                  <td>{formatDate(post.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <PaginationWrapper>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={handlePageChange}
              />
            </PaginationWrapper>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default MyPostsList;



const Wrapper = styled.div`
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Table = styled.table`
  width: 900px;
  max-width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
  border-top: 2px solid #235ba9;
  border-bottom: 2px solid #235ba9;

  th {
    background-color: #f5f9ff;
    color: #000;
    font-weight: 500;
    font-size: 15px;
    padding: 14px 0;
    height: 30px;
  }

  td {
    padding: 12px 0;
    font-size: 14px;
    color: #333;
    border-top: 1px solid #d9e5f6;
    height: 30px;
  }

  tr:nth-child(even) {
    background-color: #f7faff;
  }

  td,
  th {
    text-align: center;
  }
`;

const BoardTag = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: ${({ board }) =>
    board === '자유 게시판' ? '#1C4987' : '#235ba9'};
  color: #fff;
  font-size: 13px;
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  padding: 60px;
  color: #888;
  font-size: 15px;
  margin-right : 350px;
`;

const LoadingMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #666;
  font-size: 15px;
`;

const ErrorMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #e74c3c;
  font-size: 15px;
`;

const PaginationWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
`;

const PostTitle = styled.div`
  cursor: pointer;
  &:hover {
    color: #235ba9;
    text-decoration: underline;
  }
`;

