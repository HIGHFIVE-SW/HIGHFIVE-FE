import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ArrowDownIcon from "../../assets/images/common/ic_ArrowDown.png";

export default function CustomDropdown({
  options,
  selected,
  onSelect,
  placeholder = "선택해주세요",
  borderColor = "#ccc",
  hoverColor = "#f6faff",
  backgroundColor = "white",
  textColor = "#000",
  placeholderColor = "#aaa",
  height = "20px",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const [maxWidth, setMaxWidth] = useState(180);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "14px sans-serif";

    const textWidths = [...options, placeholder].map((text) =>
      context.measureText(text).width
    );
    const maxTextWidth = Math.max(...textWidths);
    setMaxWidth(maxTextWidth + 56);
  }, [options, placeholder]);

  return (
    <Wrapper ref={dropdownRef} style={{ width: `${maxWidth}px` }}>
      <Selected
        onClick={() => setIsOpen(!isOpen)}
        $borderColor={borderColor}
        $backgroundColor={backgroundColor}
        $height={height}
      >
        <span
          style={{
            color: selected ? textColor : placeholderColor,
          }}
        >
          {selected || placeholder}
        </span>
        <Arrow src={ArrowDownIcon} isOpen={isOpen} alt="arrow" />
      </Selected>
      {isOpen && (
        <Menu $borderColor={borderColor} $backgroundColor={backgroundColor}>
          {options.map((option) => (
            <Item
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              $hoverColor={hoverColor}
            >
              {option}
            </Item>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const Selected = styled.div`
height: ${({ $height }) => $height};
  padding: 10px 16px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ $borderColor }) => $borderColor};
  }
`;

const Arrow = styled.img`
  width: 12px;
  margin-left: 8px;
  display: inline-block;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const Menu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 8px;
  z-index: 999;
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: ${({ $hoverColor }) => $hoverColor};
    border-radius: 8px;
  }
`;
