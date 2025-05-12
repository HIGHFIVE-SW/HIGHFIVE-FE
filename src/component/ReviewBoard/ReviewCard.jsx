import React from "react";
import styled from "styled-components";

const getCategoryStyle = (category) => {
  switch (category) {
    case "환경":
      return { textColor: "#34A853" };
    case "사람과 사회":
      return { textColor: "#6B3FEF" };
    case "경제":
      return { textColor: "#E9AD00" };
    case "기술":
      return { textColor: "#1C4987" };
    default:
      return { textColor: "#333" };
  }
};

const ReviewCard = ({ category, image, title }) => {
  const { textColor } = getCategoryStyle(category);

  return (
    <Card>
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

`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
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
  font-style: normal;
  border-radius: 20px;
  font-family: "Noto Sans KR";
  font-weight: 400;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: flex;
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
