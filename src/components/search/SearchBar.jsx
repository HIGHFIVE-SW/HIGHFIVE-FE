// src/components/common/SearchBar.jsx
import React from 'react';
import styled from 'styled-components';
import SearchIcon from '../../assets/images/nav/ic_Search.png';

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
  inputRef,
}) {
  return (
    <SearchBox>
      <SearchInput
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
        placeholder={placeholder}
      />
      <SearchIconImg src={SearchIcon} alt="검색" onClick={onSearch} />
    </SearchBox>
  );
}

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 480px;
  height: 44px;
  border: 2px solid #235ba9;
  border-radius: 8px;
  padding: 0 12px;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  flex: 1;
  font-size: 16px;
  border: none;
  outline: none;
`;

const SearchIconImg = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;
