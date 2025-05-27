// src/components/common/CategoryTag.jsx
import React from 'react';
import styled from 'styled-components';

const getCategoryStyle = (category) => {
  switch (category) {
    case "환경": return { textColor: "#34A853" };
    case "사람과 사회": return { textColor: "#6B3FEF" };
    case "경제": return { textColor: "#E9AD00" };
    case "기술": return { textColor: "#1C4987" };
    default: return { textColor: "#333" };
  }
};

const CategoryTag = ({ category, position = "absolute", ...props }) => {
  const { textColor } = getCategoryStyle(category);
  
  return (
    <StyledCategoryTag 
      textColor={textColor} 
      position={position}
      {...props}
    >
      {category}
    </StyledCategoryTag>
  );
};

export default CategoryTag;

const StyledCategoryTag = styled.div`
  position: ${({ position }) => position};
  top: ${({ position }) => position === 'absolute' ? '0' : 'auto'};
  left: ${({ position }) => position === 'absolute' ? '0' : 'auto'};
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
