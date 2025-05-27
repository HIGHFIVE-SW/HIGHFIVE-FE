import React from 'react';
import styled from 'styled-components';
import CloseIcon from '../../assets/images/search/ic_close.png';
import { useNavigate } from 'react-router-dom';

export default function Search({ query, onChange, onClose, searchType }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // searchType에 따라 다른 경로로 이동
      if (searchType === 'board') {
        navigate(`/board/search?query=${encodeURIComponent(query)}`);
      } else {
        navigate(`/search?query=${encodeURIComponent(query)}`);
      }
      onClose(); 
    }
  };

  return (
    <Wrapper onClick={onClose}>
      <SearchBox onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="text"
              placeholder="검색어를 입력해주세요."
              value={query}
              onChange={(e) => onChange(e.target.value)}
            />
          </InputWrapper>
        </form>
        <CloseImage
          src={CloseIcon}
          alt="close"
          onClick={onClose}
        />
      </SearchBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  z-index: 2000;
`;

const SearchBox = styled.div`
  position: absolute;
  top: 64px;
  right: 32px;
  background-color: #ffffff;
  border-radius: 30px;
  box-shadow: 0px 4px 4px #00000040;
  width: 400px;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #000;
  outline: none;
  font-size: 24px;
  width: 300px;
  height: 60px;
`;

const CloseImage = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;