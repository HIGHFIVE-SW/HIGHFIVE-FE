import React from "react";
import styled from "styled-components";
import useLike from "../../../hooks/useLike";
import LikeButton from "../LikeButton";
import CategoryTag from "../../common/CategoryTag";
import { useNavigate } from "react-router-dom";

const ReviewCard = ({ id, category, image, title, content, date, writer, likeCount }) => {
  const { liked, count, toggleLike } = useLike(likeCount, false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/board/detail/${id}`);
  };

  return (
    <Card onClick={handleCardClick}>
      <HoverOverlay>
        <TopRow>
          <HoverContentWrapper>
            <HoverContent>{content}</HoverContent>
            {content.split(' ').length > 20 && (
            <HoverMore>더보기 &gt;</HoverMore>
            )}
          </HoverContentWrapper>
          <HoverLike onClick={(e) => e.stopPropagation()}>
            <LikeButton liked={liked} count={count} onClick={toggleLike} /> 
          </HoverLike>
        </TopRow>
        <HoverBottom>
          <HoverDate>{date}</HoverDate>
          <HoverWriter>{writer}</HoverWriter>
        </HoverBottom>
      </HoverOverlay>

      <ImageContainer>
        <StyledImage src={image} alt={title} />
        <CategoryTag category={category} />
        <OverlayTitle>{title}</OverlayTitle>
      </ImageContainer>
    </Card>
  );
};

export default ReviewCard;

// 기존 스타일들 (CategoryTag 관련 스타일 제거)
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

  &:hover div.hover-overlay {
    opacity: 1;
  }
`;

const StyledImage = styled.img`
  width: 350px;
  height: 450px;
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
