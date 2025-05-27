// ActivitySearchInput.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const DUMMY_ACTIVITIES = [
  "잠자기 공모전",
  "프론트 공모전",
  "밥먹기 공모전",
  "어라 어라 너 하 러 공모전",
];

export default function ActivitySearchInput({ value, onChange }) {
  const [query, setQuery] = useState(value);
  const [filtered, setFiltered] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    setFiltered(
      query
        ? DUMMY_ACTIVITIES.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
          )
        : []
    );
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      <Input
        value={query}
        placeholder="참여한 대외활동을 검색하세요"
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(""); // 초기화
        }}
        onFocus={() => setIsFocused(true)}
      />
      {isFocused && filtered.length > 0 && (
        <ResultList>
          {filtered.map((item, idx) => (
            <ResultItem
              key={idx}
              onClick={() => {
                setQuery(item);
                onChange(item);
                setIsFocused(false);
              }}
            >
              {item}
            </ResultItem>
          ))}
        </ResultList>
      )}
      {isFocused && query && filtered.length === 0 && (
        <ResultList>
          <ResultItem>검색 결과가 없습니다</ResultItem>
        </ResultList>
      )}
    </Wrapper>
  );
}

// Styled components
const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 14px;
  border: 1px solid #235ba9;
  border-radius: 6px;
  width: 100%;
  height: 22px;

   &::placeholder {
    color: #aaa;
    font-size: 14px;
  }
`;

const ResultList = styled.ul`
  position: absolute;
  top: 100%;
  width: 100%;
  background: white;
  border: 1px solid #dcdcdc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ResultItem = styled.li`
  padding: 12px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #f2f8ff;
  }
`;
