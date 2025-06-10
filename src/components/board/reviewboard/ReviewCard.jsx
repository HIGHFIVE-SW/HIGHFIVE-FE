import React, { useEffect } from "react";
import styled from "styled-components";
import { useToggleReviewLike } from "../../../query/usePost";
import { useReviewLikeStore } from "../../../store/reviewLikeStore";
import LikeButton from "../LikeButton";
import CategoryTag from "../../common/CategoryTag";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';

const ReviewCard = ({ id, category, image, title, content, date, writer, likeCount, liked: initialLiked }) => {
  const { likeMap, setLike, updateLike } = useReviewLikeStore();
  const likeState = likeMap[id] || { liked: initialLiked || false, likeCount: likeCount || 0 };
  const toggleReviewLikeMutation = useToggleReviewLike();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageError, setImageError] = React.useState(false);

  // HTML 태그 제거 함수
  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // 초기 좋아요 상태 설정
  useEffect(() => {
    if (id && typeof initialLiked !== 'undefined' && typeof likeCount !== 'undefined') {
      console.log('ReviewCard 초기 좋아요 상태 설정:', {
        id,
        initialLiked,
        likeCount,
        현재스토어상태: likeMap[id]
      });
      
      // 스토어에 해당 ID가 없을 때만 설정 (이미 클릭으로 변경된 상태 보존)
      if (!likeMap[id]) {
        setLike(id, initialLiked, likeCount);
      }
    }
  }, [id, initialLiked, likeCount, setLike, likeMap]);

  const handleCardClick = () => {
    navigate(`/board/review/${id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // 후기 전용 좋아요 버튼 클릭 핸들러
  const handleLikeClick = async (e) => {
    e.stopPropagation();
    
    const currentState = likeState;
    
    console.log('ReviewCard 좋아요 클릭:', {
      id,
      currentState,
      liked: currentState.liked,
      likeCount: currentState.likeCount
    });
    
    try {
      // 1. 즉시 UI 업데이트 (Optimistic Update)
      const newLiked = !currentState.liked;
      const newCount = currentState.likeCount + (newLiked ? 1 : -1);
      
      console.log('Optimistic Update:', { newLiked, newCount });
      
      // Zustand 상태 즉시 업데이트
      updateLike(id, newLiked, newCount);
      
      // 2. 서버 요청
      const result = await toggleReviewLikeMutation.mutateAsync(id);
      
      // 3. 서버 응답으로 정확한 상태 동기화
      const serverLiked = result.liked ?? result.like ?? newLiked;
      const serverCount = result.likeCount ?? newCount;
      
      console.log('서버 응답 동기화:', {
        result,
        serverLiked,
        serverCount
      });
      
      updateLike(id, serverLiked, serverCount);
      
      // 4. React Query 캐시 업데이트 (상세 페이지와 동기화)
      queryClient.setQueryData(['review', id], (oldData) => {
        if (oldData?.result) {
          return {
            ...oldData,
            result: {
              ...oldData.result,
              liked: serverLiked,
              likeCount: serverCount
            }
          };
        } else if (oldData) {
          // 상세 페이지 데이터가 직접 저장된 경우
          return {
            ...oldData,
            liked: serverLiked,
            likeCount: serverCount
          };
        }
        return oldData;
      });

      // 5. 리뷰 리스트 캐시도 업데이트
      queryClient.setQueriesData(
        { queryKey: ['reviews'] },
        (oldData) => {
          if (oldData?.result?.content) {
            return {
              ...oldData,
              result: {
                ...oldData.result,
                content: oldData.result.content.map(review =>
                  review.id === id
                    ? { ...review, liked: serverLiked, likeCount: serverCount }
                    : review
                )
              }
            };
          }
          return oldData;
        }
      );
      
    } catch (error) {
      // 실패 시 이전 상태로 롤백
      updateLike(id, currentState.liked, currentState.likeCount);
      console.error('후기 좋아요 처리 실패:', error);
    }
  };

  const plainContent = stripHtml(content);

  // 디버깅용 로그
  console.log('ReviewCard 렌더링:', {
    id,
    title,
    image,
    imageError,
    hasImage: !!image
  });

  return (
    <Card onClick={handleCardClick}>
      <HoverOverlay>
        <TopRow>
          <HoverContentWrapper>
            <HoverContent>{plainContent}</HoverContent>
            {plainContent.split(' ').length > 20 && (
              <HoverMore>더보기 &gt;</HoverMore>
            )}
          </HoverContentWrapper>
          <HoverLike onClick={handleLikeClick}>
            <LikeButton 
              liked={likeState.liked} 
              count={likeState.likeCount} 
              onClick={handleLikeClick}
              disabled={toggleReviewLikeMutation.isPending}
            /> 
          </HoverLike>
        </TopRow>
        <HoverBottom>
          <HoverDate>{date}</HoverDate>
          <HoverWriter>{writer}</HoverWriter>
        </HoverBottom>
      </HoverOverlay>

      <ImageContainer>
        {image && !imageError ? (
          <StyledImage 
            src={image} 
            alt={title} 
            onError={handleImageError}
          />
        ) : (
          <NoImagePlaceholder>
            <NoImageText>이미지 없음</NoImageText>
          </NoImagePlaceholder>
        )}
        <CategoryTag category={category} />
        <OverlayTitle>{title}</OverlayTitle>
      </ImageContainer>
    </Card>
  );
};

export default ReviewCard;

// 스타일 컴포넌트들은 동일...
const Card = styled.div`
  width: 353px;
  height: 453px;
  background-color: #F6FAFF;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  position: relative;

  &:hover .hover-overlay {
    opacity: 1;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  width: 100%;
  height: 100%;

  &:hover div.hover-overlay {
    opacity: 1;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 20px;
`;

const OverlayTitle = styled.div`
  position: absolute;
  bottom: 12px;
  left: 16px;
  right: 16px;
  font-size: 33px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
  line-height: 1.4;
  word-break: keep-all;
  z-index: 1;
`;

const HoverOverlay = styled.div.attrs({ className: "hover-overlay" })`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const HoverLike = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
  flex-direction: column;
  margin-right: 12px;
  margin-top: 12px;

  img {
    width: 24px;
    height: 24px;
  }
  
  span {
    margin-top: 1px;
  }
`;

const HoverContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  margin-top: 28px;
`;

const HoverContent = styled.div`
  font-size: 18px;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 12px;
`;

const HoverBottom = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 12px;
`;

const HoverDate = styled.div`
  font-size: 18px;
  margin-bottom: 12px;
  margin-left: 12px;
`;

const HoverWriter = styled.div`
  font-size: 18px;
  margin-bottom: 12px;
  margin-right: 12px;
`;

const HoverMore = styled.div`
  font-size: 16px;
  color: #fff;
`;

const NoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
`;

const NoImageText = styled.div`
  color: #666;
  font-size: 16px;
  font-weight: 500;
`;
