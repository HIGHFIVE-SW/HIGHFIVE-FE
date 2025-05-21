import React, { useState } from "react";
import styled from "styled-components";
import BoardNav from "../../layout/board/BoardNav";
import BoardSidebar from "../../layout/board/BoardSideNav";
import Footer from "../../layout/Footer";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";
import CustomDropdown from "../../components/common/CustomDropdown";
import writeIcon from "../../assets/images/board/ic_Write.png";
import PostList from "../../components/board/freeboard/FreePostList";
import { useNavigate } from "react-router-dom";

const dummyPosts = [
  {
    post_id: "id-1",
    post_title: "이번 주말에 공모전 팀 구합니다",
    authorName: "김지현",
    created_at: "2025-05-18",
    post_like_count: 12,
  },
  {
    post_id: "id-2",
    post_title: "캡스톤 설문조사 부탁드려요!",
    authorName: "이서정",
    created_at: "2025-05-17",
    post_like_count: 8,
  },
  {
    post_id: "id-3",
    post_title: "리액트 네이티브 질문 있어요",
    authorName: "홍길동",
    created_at: "2025-05-16",
    post_like_count: 5,
  },
  {
    post_id: "id-4",
    post_title: "도서 추천 받아요 📚",
    authorName: "박소연",
    created_at: "2025-05-15",
    post_like_count: 3,
  },
  {
    post_id: "id-5",
    post_title: "스터디 같이 하실 분!",
    authorName: "최민호",
    created_at: "2025-05-14",
    post_like_count: 10,
  },
  {
    post_id: "id-6",
    post_title: "우리 학과 졸업 전시회 후기",
    authorName: "정유나",
    created_at: "2025-05-13",
    post_like_count: 6,
  },
  {
    post_id: "id-7",
    post_title: "요즘 날씨 너무 좋네요 ☀️",
    authorName: "한지훈",
    created_at: "2025-05-12",
    post_like_count: 2,
  },
  {
    post_id: "id-8",
    post_title: "다들 포트폴리오 어떻게 만들고 계세요?",
    authorName: "이수빈",
    created_at: "2025-05-11",
    post_like_count: 9,
  },
  {
    post_id: "id-9",
    post_title: "기획 공모전 추천 좀 해주세요",
    authorName: "강도윤",
    created_at: "2025-05-10",
    post_like_count: 7,
  },
  {
    post_id: "id-10",
    post_title: "프론트엔드 면접 후기 공유합니다",
    authorName: "오지훈",
    created_at: "2025-05-09",
    post_like_count: 13,
  },
  {
    post_id: "id-11",
    post_title: "프론트엔드 면접 후기 공유합니다",
    authorName: "오지훈",
    created_at: "2025-05-09",
    post_like_count: 14,
  },
];


export default function FreeBoardPage() {
  const [sortOrder, setSortOrder] = useState("최신순");
  const navigate = useNavigate();
  // 정렬 로직
  const sortedPosts = [...dummyPosts].sort((a, b) => {
    if (sortOrder === "최신순") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOrder === "추천순") {
      return b.post_like_count - a.post_like_count;
    }
    return 0;
  });

  // 페이지네이션 적용
  const itemsPerPage = 10;
  const {
    currentPage,
    totalPages,
    currentData: currentPosts,
    goToPage,
  } = usePagination(sortedPosts, itemsPerPage);


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
                onSelect={setSortOrder}
            />
            </SortBox>
            <WriteButton onClick={() => navigate("/board/write")}>
                <WriteIcon src={writeIcon} alt="글쓰기" /> 글쓰기
            </WriteButton>
        </SortWriteWrapper>

        {/* 게시글 리스트 렌더링 */}
        <PostList
            posts={currentPosts}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
        />

        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
        />
        </RightContent>
      </MainLayout>
      <Footer />
    </>
  );
}

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