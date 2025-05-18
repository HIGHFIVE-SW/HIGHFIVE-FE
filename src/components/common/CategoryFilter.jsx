import React from "react";
import styled from "styled-components";

const categories = ["전체", "환경", "사람과 사회", "경제", "기술"];

const FilterWrapper = styled.div`
  display: flex;
  gap: 200px;
  padding: 16px;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  border: none;
  background-color: ${({ selected }) => (selected ? "#235BA9" : "transparent")};
  color: ${({ selected }) => (selected ? "#ffffff" : "#000000")};
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
`;

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  
  return (
    <FilterWrapper>
      {categories.map((category) => (
        <FilterButton
          key={category}
          selected={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </FilterButton>
      ))}
    </FilterWrapper>
  );
};

export default CategoryFilter;