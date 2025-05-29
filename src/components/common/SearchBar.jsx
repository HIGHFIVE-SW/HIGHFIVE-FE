import React from 'react';
import styled from 'styled-components';

const SearchBar = ({ value, onChange, onSearch, placeholder, inputRef }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <SearchButton onClick={onSearch}>검색</SearchButton>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 600px;
  height: 60px;
  border: 2px solid #235BA9;
  border-radius: 30px;
  padding: 0 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  padding: 0 10px;
  &::placeholder {
    color: #999;
  }
`;

const SearchButton = styled.button`
  width: 80px;
  height: 40px;
  background-color: #235BA9;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #1a4b8c;
  }
`;

export default SearchBar; 