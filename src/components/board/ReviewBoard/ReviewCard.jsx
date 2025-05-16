import React from "react";
import styled from "styled-components";
import useLike from "../../../hooks/useLike";
import LikeButton from "../LikeButton";

const getCategoryStyle = (category) => {
  switch (category) {
    case "환경": return { textColor: "#34A853" };
    case "사람과 사회": return { textColor: "#6B3FEF" };
    case "경제": return { textColor: "#E9AD00" };
    case "기술": return { textColor: "#1C4987" };
    default: return { textColor: "#333" };
  }
};

const ReviewCard = ({ category, image, title, content, date, writer, likeCount }) => {
  const { textColor } = getCategoryStyle(category);
    const { liked, count, toggleLike } = useLike(likeCount, false);

  return (
    <Card>
      <HoverOverlay>
        <TopRow>
          <HoverContentWrapper>
            <HoverContent>{content}</HoverContent>
            {content.split(' ').length > 20 && (  // ✨ 예: 단어 40개 이상이면 더보기 표시
            <HoverMore>더보기 &gt;</HoverMore>
            )}
          </HoverContentWrapper>
          <HoverLike>
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
        <CategoryTag textColor={textColor}>{category}</CategoryTag>
        <OverlayTitle>{title}</OverlayTitle>
      </ImageContainer>
    </Card>
  );
};

export default ReviewCard;



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

const CategoryTag = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #F6FAFF;
  color: ${({ textColor }) => textColor};
  border: 1.5px solid ${({ textColor }) => textColor};
  box-sizing: border-box;
  padding: 10px 20px;
  font-size: 20px;
  border-radius: 20px;
  font-family: "Noto Sans KR";
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
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
  pointer-events: auto;;
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
  font-size: 16px;
  margin-bottom: 12px;
  margin-left: 12px;
`;
const HoverWriter = styled.div`
  font-size: 16px;
  margin-bottom: 12px;
  margin-right: 12px;
`;

const HoverMore = styled.div`
  font-size: 16px;
  color: #fff;
`;