import React from 'react';
import styled from 'styled-components';
import CloseIcon from '../../assets/images/search/ic_close.png';

export default function Search({ query, onChange, onClose }) {
  return (
    <Wrapper>
      <SearchBox>
        <InputWrapper>
          <Input
            type="text"
            placeholder="검색어를 입력해주세요."
            value={query}
            onChange={(e) => onChange(e.target.value)}
          />
        </InputWrapper>
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
  position: absolute;
  top: 64px;
  right: 32px;
  z-index: 100;
`;

const SearchBox = styled.div`
  position: relative;
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
  width: 20px;
  height: 20px;
  cursor: pointer;
`;