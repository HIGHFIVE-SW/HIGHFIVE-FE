import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BoardNav from "../../layout/board/BoardNav";
import BoardSidebar from "../../layout/board/BoardSideNav";
import Footer from "../../layout/Footer";
import Pagination from "../../components/common/Pagination";
import CustomDropdown from "../../components/common/CustomDropdown";
import writeIcon from "../../assets/images/board/ic_Write.png";
import PostList from "../../components/board/freeboard/FreePostList";
import { useNavigate } from "react-router-dom";
import { usePosts, usePostsByLikes } from "../../query/usePost";
import { formatDate } from '../../utils/formatDate';

export default function FreeBoardPage() {
  const [sortOrder, setSortOrder] = useState("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  const itemsPerPage = 10;
  
  // 정렬 방식에 따라 다른 API 호출
  const { 
    data: latestPostsData, 
    isLoading: isLatestLoading, 
    isError: isLatestError, 
    error: latestError 
  } = usePosts(currentPage - 1, itemsPerPage, {
    enabled: sortOrder === "최신순"
  });

  const { 
    data: likedPostsData, 
    isLoading: isLikedLoading, 
    isError: isLikedError, 
    error: likedError 
  } = usePostsByLikes(currentPage - 1, itemsPerPage, {
    enabled: sortOrder === "추천순"
  });

  // 현재 선택된 정렬에 따른 데이터 선택
  const isLoading = sortOrder === "최신순" ? isLatestLoading : isLikedLoading;
  const isError = sortOrder === "최신순" ? isLatestError : isLikedError;
  const error = sortOrder === "최신순" ? latestError : likedError;
  const postsData = sortOrder === "최신순" ? latestPostsData : likedPostsData;

  // 로딩 중일 때
  if (isLoading) {
    return (
      <>
        <BoardNav />
        <HeaderSection>
          <Title>자유 게시판</Title>
          <Subtitle>모두의 이야기, 모두의 공간</Subtitle>
        </HeaderSection>
        <MainLayout>
          <BoardSidebar />
          <RightContent>
            <LoadingMessage>게시물을 불러오는 중...</LoadingMessage>
          </RightContent>
        </MainLayout>
        <Footer />
      </>
    );
  }

  // 에러 발생 시
  if (isError) {
    return (
      <>
        <BoardNav />
        <HeaderSection>
          <Title>자유 게시판</Title>
          <Subtitle>모두의 이야기, 모두의 공간</Subtitle>
        </HeaderSection>
        <MainLayout>
          <BoardSidebar />
          <RightContent>
            <ErrorMessage>
              게시물을 불러오는데 실패했습니다: {error?.message}
            </ErrorMessage>
          </RightContent>
        </MainLayout>
        <Footer />
      </>
    );
  }

  // API 응답 데이터 구조에 맞게 변환
  const posts = postsData?.content || [];
  const totalPages = postsData?.totalPages || 1;

  const handleSortChange = (option) => {
    setSortOrder(option);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (postId) => {
    navigate(`/board/detail/${postId}`);
  };

  return (
    <>
      <BoardNav />
      <HeaderSection>
        <Title>자유 게시판</Title>
        <Subtitle>모두의 이야기, 모두의 공간</Subtitle>
      </HeaderSection>
      <MainLayout>
        <BoardSidebar />
        <RightContent>
          <SortWriteWrapper>
            <SortBox>
              <CustomDropdown
                options={["최신순", "추천순"]}
                selected={sortOrder}
                onSelect={handleSortChange}
              />
            </SortBox>
            <WriteButton onClick={() => navigate("/board/write")}>
              <WriteIcon src={writeIcon} alt="글쓰기" /> 글쓰기
            </WriteButton>
          </SortWriteWrapper>

          {/* 게시글 리스트 렌더링 */}
          {posts.length === 0 ? (
            <NoPostsMessage>등록된 게시물이 없습니다.</NoPostsMessage>
          ) : (
            <PostList
              posts={posts.map(post => ({
                post_id: post.id,
                post_title: post.title,
                authorName: post.nickname,
                created_at: formatDate(post.createdAt),
                post_like_count: post.likeCount
              }))}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPostClick={handlePostClick}
            />
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={handlePageChange}
          />
        </RightContent>
      </MainLayout>
      <Footer />
    </>
  );
}

// 스타일드 컴포넌트들
const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #ff4444;
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #999;
`;

const HeaderSection = styled.div`
  background-color: #f9fbff;
  text-align: center;
  padding: 50px 0;
  position: relative;
`;

const Title = styled.h1`
  font-size: 44px;
  color: #000000;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 24px;
  color: #656565;
  margin: 20px 0 0;
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 8px;
`;

const RightContent = styled.div`
  flex: 1;
  padding: 0 24px;
`;

const SortWriteWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 16px;
`;

const SortBox = styled.div`
  display: flex;
  gap: 8px;
`;

const WriteButton = styled.button`
  width: 100px;
  background-color: #235ba9;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const WriteIcon = styled.img`
  width: 16px;
  height: 16px;
`;
