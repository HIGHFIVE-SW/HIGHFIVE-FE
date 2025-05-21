import React, { useState } from "react";
import styled from "styled-components";
import ArrowDownIcon from "../../assets/images/common/ic_ArrowDown.png";

const MonthPicker = ({ selectedMonth, onSelect, placeholder = "날짜 선택", borderColor = "#ccc", placeholderColor = "#aaa", height = "40px" }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);

  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];

  const toggleOpen = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const handleMonthClick = (monthIndex) => {
    const formatted = `${selectedYear}.${String(monthIndex + 1).padStart(2, "0")}`;
    onSelect(formatted);
    close();
  };

  const handlePrevYear = () => setSelectedYear(y => y - 1);
  const handleNextYear = () => setSelectedYear(y => y + 1);

  return (
    <Wrapper>
      <PickerButton onClick={toggleOpen} $borderColor={borderColor} $height={height}>
        <span style={{ color: selectedMonth ? "#000" : placeholderColor }}>
          {selectedMonth || placeholder}
        </span>
        <Arrow src={ArrowDownIcon} isOpen={isOpen} alt="arrow" />
      </PickerButton>
      {isOpen && (
        <Dropdown>
          <YearSelector>
            <ArrowButton onClick={handlePrevYear}>◀</ArrowButton>
            <Year>{selectedYear}</Year>
            <ArrowButton onClick={handleNextYear}>▶</ArrowButton>
          </YearSelector>
          <MonthGrid>
            {months.map((m, idx) => (
              <MonthItem key={idx}>
                <MonthButton
                  onClick={() => handleMonthClick(idx)}
                  $isSelected={selectedMonth === `${selectedYear}.${String(idx + 1).padStart(2, "0")}`}
                >
                  {m}
                </MonthButton>
              </MonthItem>
            ))}
          </MonthGrid>
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default MonthPicker;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PickerButton = styled.div`
  width: 100%;
  height: ${({ $height }) => $height};
  padding: 10px 16px;
  background-color: white;
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
`;

const Arrow = styled.img`
  width: 12px;
  margin-left: 8px;
  display: inline-block;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  min-width: 260px;
  background: white;
  border: 1px solid #235ba9;
  border-radius: 8px;
  z-index: 1000;
  padding: 12px;
`;

const YearSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
`;

const Year = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 8px;
  justify-items: center;
`;

const MonthItem = styled.div`
  width: 80px;
`;

const MonthButton = styled.button`
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#235ba9" : "#ccc")};
  background: ${({ $isSelected }) => ($isSelected ? "#235ba9" : "#fff")};
  color: ${({ $isSelected }) => ($isSelected ? "#fff" : "#000")};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f0f6ff;
    border-color: #235ba9;
  }
`;
