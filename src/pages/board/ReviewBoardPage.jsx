import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import helpIcon from "../../assets/images/common/ic_Help.png";
import writeIcon from "../../assets/images/board/ic_Write.png";
import ReviewCard from "../../components/board/reviewboard/ReviewCard";
import CategoryFilter from "../../components/common/CategoryFilter";
import SampleReviewImg from "../../assets/images/board/SampleReviewImg.png";
import BoardNav from "../../layout/board/BoardNav";
import BoardSidebar from "../../layout/board/BoardSideNav";
import ReviewBoardGuide from "../../components/board/reviewboard/ReviewBoardGuide";
import Footer from "../../layout/Footer";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";
import CustomDropdown from "../../components/common/CustomDropdown";


const reviews = [
  {
    id: 1,
    category: "환경",
    image: SampleReviewImg,
    title: "국제수면산업박람회 아이디어 공모전 시상식 후기!",
    content: "국제수면산업 박람회에 참가해서 영예의 대상을 수상했어요! 새롭고 흥미로운 아이디어를 나눌 수 있어서 정말 즐거운 경험이었답니다. 좋은 사람들과 함께한 뜻깊은 시간이었고 서로의 아이디어를 존중하며 소통할 수 있었던 현장이었어요. 다양한 분야의 전문가들과 인사이트를 주고받으며 수면 산업의 무한한 가능성을 다시금 느낄 수 있었고요.",
    date: "2025.04.11",
    writer: "이서정",
    likeCount: 20,
  },
  {
    id: 2,
    category: "경제",
    image: SampleReviewImg,
    title: "창업 공모전 참가 후기",
    content:
      "국제수면산업 박람회에 참가해서 영예의 대상을 수상했어요! 새롭고 흥미로운 아이디어를 나눌 수 있어서 정말 즐거운 경험이었습니다. 좋은 사람들과 함께한 뜻깊은 자리였어요.",
    date: "2025.04.10",
    writer: "김지민",
    likeCount: 12,
  },
  {
    id: 3,
    category: "사람과 사회",
    image: SampleReviewImg,
    title: "봉사활동 후기",
    content: "지역 아동센터에서 봉사한 뜻깊은 경험을 나눕니다.",
    date: "2025.04.08",
    writer: "박은서",
    likeCount: 8,
  },
  {
    id: 4,
    category: "기술",
    image: SampleReviewImg,
    title: "기술공모전 참가 후기",
    content: "사물인터넷 아이디어로 본선 진출한 후기를 공유합니다.",
    date: "2025.04.06",
    writer: "최현우",
    likeCount: 17,
  },
  {
    id: 5,
    category: "환경",
    image: SampleReviewImg,
    title: "플로깅 캠페인 참여 후기",
    content: "쓰레기를 줍는 재미와 성취감을 느꼈던 하루였습니다.",
    date: "2025.04.05",
    writer: "이수진",
    likeCount: 6,
  },
  {
    id: 6,
    category: "경제",
    image: SampleReviewImg,
    title: "스타트업 투자 피칭 후기",
    content: "투자자 앞에서 발표했던 경험을 자세히 적었습니다.",
    date: "2025.04.04",
    writer: "홍진호",
    likeCount: 11,
  },
  {
    id: 7,
    category: "사람과 사회",
    image: SampleReviewImg,
    title: "지역 사회 자원봉사 후기",
    content: "노인복지회관에서 활동한 따뜻한 이야기를 담았습니다.",
    date: "2025.04.02",
    writer: "유지연",
    likeCount: 9,
  },
  {
    id: 8,
    category: "기술",
    image: SampleReviewImg,
    title: "AI 해커톤 참가 후기",
    content: "챗봇을 개발한 경험을 정리한 후기를 공유합니다.",
    date: "2025.04.01",
    writer: "정우진",
    likeCount: 14,
  },
  {
    id: 9,
    category: "환경",
    image: SampleReviewImg,
    title: "제로웨이스트 캠페인 체험기",
    content: "일회용품 없이 생활해본 도전기를 작성했습니다.",
    date: "2025.03.30",
    writer: "박채원",
    likeCount: 7,
  },
  {
    id: 10,
    category: "경제",
    image: SampleReviewImg,
    title: "청년 창업 페어 부스 운영 후기",
    content: "부스 운영을 통해 고객과 직접 소통한 생생한 이야기입니다.",
    date: "2025.03.28",
    writer: "정하늘",
    likeCount: 13,
  },
];

export default function ReviewBoardPage() {
  const TypeCategories = ["전체", "공모전", "봉사활동", "서포터즈", "인턴십"];

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedTypeCategory, setSelectedTypeCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const filteredReviews =
    selectedCategory === "전체"
      ? reviews
      : reviews.filter((r) => r.category === selectedCategory);

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOrder === "최신순") return new Date(b.date) - new Date(a.date);
    if (sortOrder === "추천순") return b.likeCount - a.likeCount;
    return 0;
  });

  //페이지네이션 
  const itemsPerPage = 9;
  const { currentPage, totalPages, currentData, goToPage } = usePagination(sortedReviews, itemsPerPage);

  return (
    <>
      <BoardNav />
      <HeaderSection>
        <HelpWrapper>
          <HelpIcon src={helpIcon} alt="도움말" onClick={() => setIsGuideOpen(!isGuideOpen)} />
          {isGuideOpen && (
            <Popover>
              <ReviewBoardGuide onClose={() => setIsGuideOpen(false)} />
            </Popover>
          )}
        </HelpWrapper>
        <Title>후기 게시판</Title>
        <Subtitle>후기 공유하고 포인트 받자!</Subtitle>
      </HeaderSection>

      <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

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
              <CustomDropdown
                options={TypeCategories}
                selected={selectedTypeCategory}
                onSelect={setSelectedTypeCategory}
              />
            </SortBox>
            <WriteButton>
              <WriteIcon src={writeIcon} alt="글쓰기" /> 글쓰기
            </WriteButton>
          </SortWriteWrapper>

          <CardGrid>
            {currentData.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </CardGrid>
        </RightContent>
      </MainLayout>      
      <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
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

const HelpWrapper = styled.div`
  position: absolute;
  top: 24px;
  right: 48px;
`;

const HelpIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Popover = styled.div`
  position: absolute;
  right: 0;
  z-index: 1000;
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px 0;
`;
