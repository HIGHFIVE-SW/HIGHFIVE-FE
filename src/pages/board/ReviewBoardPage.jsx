import React, { useState, useRef, useEffect } from "react";
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
import Pagination from "../../components/common/Pagination";
import CustomDropdown from "../../components/common/CustomDropdown";
import { useNavigate } from "react-router-dom";
import { getReviews } from "../../api/PostApi";
import { CATEGORY_MAP, ACTIVITY_TYPE_MAP } from "../../api/PostApi";
import { useReviewLikeStore } from "../../store/reviewLikeStore"; // 추가

export default function ReviewBoardPage() {
  const TypeCategories = ["전체", "공모전", "봉사활동", "서포터즈", "인턴십"];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedTypeCategory, setSelectedTypeCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Zustand 스토어에서 좋아요 상태 관리 함수들 가져오기
  const { setBulkLikes } = useReviewLikeStore();

  // HelpWrapper 전체를 감싸는 ref
  const helpWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // HelpWrapper 내부 클릭은 무시
      if (helpWrapperRef.current?.contains(e.target)) return;
      // 외부 클릭만 닫기
      setIsGuideOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const keyword = selectedCategory === "전체" ? null : CATEGORY_MAP[selectedCategory];
        const activityType = selectedTypeCategory === "전체" ? null : ACTIVITY_TYPE_MAP[selectedTypeCategory];
        const sort = sortOrder === "최신순" ? "RECENT" : "LIKES";
        
        console.log('정렬 기준:', {
          sortOrder,
          sort
        });
        
        // API는 0부터 시작하므로 currentPage - 1을 전달
        const result = await getReviews(currentPage - 1, keyword, activityType, sort);
        
        // 리뷰 데이터 설정
        setReviews(result.content);
        setTotalPages(result.totalPages);
        
        // Zustand 스토어에 좋아요 상태 일괄 설정
        if (result.content && result.content.length > 0) {  
          console.log('리뷰 리스트 좋아요 상태 일괄 설정:', result.content.map(review => ({
            id: review.id,
            liked: review.liked || false,
            likeCount: review.likeCount || 0
          })));
          
          setBulkLikes(result.content.map(review => ({
            id: review.id,
            liked: review.liked || false,
            likeCount: review.likeCount || 0
          })));
        }
        
      } catch (error) {
        console.error('리뷰 조회 실패:', error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [selectedCategory, selectedTypeCategory, sortOrder, currentPage, setBulkLikes]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTypeCategoryChange = (type) => {
    setSelectedTypeCategory(type);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    console.log('정렬 변경:', sort);
    setSortOrder(sort);
    setCurrentPage(1);
  };

  return (
    <>
      <BoardNav />
      <HeaderSection>
        {/* HelpWrapper에 ref 지정 */}
        <HelpWrapper ref={helpWrapperRef}>
          <HelpIcon
            src={helpIcon}
            alt="도움말"
            onClick={() => setIsGuideOpen((prev) => !prev)}
          />
          {isGuideOpen && (
            <Popover>
              <ReviewBoardGuide onClose={() => setIsGuideOpen(false)} />
            </Popover>
          )}
        </HelpWrapper>

        <Title>후기 게시판</Title>
        <Subtitle>후기 공유하고 포인트 받자!</Subtitle>
      </HeaderSection>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

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
              <CustomDropdown
                options={TypeCategories}
                selected={selectedTypeCategory}
                onSelect={handleTypeCategoryChange}
              />
            </SortBox>
            <WriteButton onClick={() => navigate("/board/write")}>
              <WriteIcon src={writeIcon} alt="글쓰기" /> 글쓰기
            </WriteButton>
          </SortWriteWrapper>

          <CardGrid>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  category={review.keyword}
                  image={review.imageUrls?.[0] || SampleReviewImg}
                  title={review.title}
                  content={review.content}
                  date={new Date(review.createAt || review.createdAt).toLocaleDateString()}
                  writer={review.nickname}
                  likeCount={review.likeCount || 0}
                  liked={review.liked || false}
                />
              ))
            ) : (
              <NoReviewsMessage>
                등록된 후기가 없습니다.
              </NoReviewsMessage>
            )}
          </CardGrid>
        </RightContent>
      </MainLayout>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={handlePageChange}
        />
      )}
      <Footer />
    </>
  );
}

// styled-components
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
  
  &:hover {
    background-color: #1a4a8a;
  }
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
  min-height: 400px;
`;

const NoReviewsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin: 20px 0;
`;
