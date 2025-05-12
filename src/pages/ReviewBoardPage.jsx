import React, { useState } from "react";
import styled from "styled-components";
import helpIcon from "../assets/images/common/ic_Help.png";
import writeIcon from "../assets/images/board/ic_Write.png";
import ReviewCard from "../component/ReviewBoard/ReviewCard";
import CategoryFilter from "../component/common/CategoryFilter";
import SampleReviewImg from "../assets/images/board/SampleReviewImg.png";
import BoardNav from "../layout/board/BoardNav";
import BoardSidebar from "../layout/board/BoardSideNav";

// 더미 데이터
const reviews = [
  {
    id: 1,
    category: "환경",
    image: SampleReviewImg,
    title: "국제수면산업박람회 아이디어 공모전 시상식 후기!",
  },
  {
    id: 2,
    category: "경제",
    image: SampleReviewImg,
    title: "창업 공모전 참가 후기",
  },
  {
    id: 3,
    category: "사람과 사회",
    image: SampleReviewImg,
    title: "봉사활동 후기",
  },
  {
    id: 4,
    category: "기술",
    image: SampleReviewImg,
    title: "기술공모전 참가 후기",
  },
  {
    id: 5,
    category: "환경",
    image: SampleReviewImg,
    title: "플로깅 캠페인 참여 후기",
  },
  {
    id: 6,
    category: "경제",
    image: SampleReviewImg,
    title: "스타트업 투자 피칭 후기",
  },
  {
    id: 7,
    category: "사람과 사회",
    image: SampleReviewImg,
    title: "지역 사회 자원봉사 후기",
  },
  {
    id: 8,
    category: "기술",
    image: SampleReviewImg,
    title: "AI 해커톤 참가 후기",
  },
  {
    id: 9,
    category: "환경",
    image: SampleReviewImg,
    title: "제로웨이스트 캠페인 체험기",
  },
  {
    id: 10,
    category: "경제",
    image: SampleReviewImg,
    title: "청년 창업 페어 부스 운영 후기",
  },
];


export default function ReviewBoardPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [selectedBoard, setSelectedBoard] = useState("후기 게시판");

  const filteredReviews =
    selectedCategory === "전체"
      ? reviews
      : reviews.filter((r) => r.category === selectedCategory);

  return (
    <>
      <BoardNav />
      <HeaderSection>
        <Title>후기 게시판</Title>
        <Subtitle>후기 공유하고 포인트 받자!</Subtitle>
        <HelpIcon src={helpIcon} alt="도움말" />
      </HeaderSection>
      <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

      <MainLayout>
        <BoardSidebar />
        <RightContent>
          <SortWriteWrapper>
            <SortSelect
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="최신순">최신순</option>
              <option value="추천순">추천순</option>
            </SortSelect>

            <WriteButton>
              <WriteIcon src={writeIcon} alt="글쓰기" />
              글쓰기
            </WriteButton>
          </SortWriteWrapper>

          <CardGrid>
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </CardGrid>
        </RightContent>
      </MainLayout>
    </>
  );
}

const HeaderSection = styled.div`
  background-color: #f9fbff;
  text-align: center;
  padding: 24px 0;
  position: relative;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #000000;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #656565;
  margin: 8px 0 0;
`;

const HelpIcon = styled.img`
  position: absolute;
  top: 24px;
  right: 16px;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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

const SortSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
  cursor: pointer;
`;

const WriteButton = styled.button`
  background-color: #235ba9;
  color: #ffffff;
  border: none;
  border-radius: 16px;
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px 0;
`;
