// src/components/board/LikeButton.jsx
import React from "react";
import styled from "styled-components";
import LikeDefaultIcon from "../../assets/images/board/ic_LikeDefault.png";
import LikeSelectedIcon from "../../assets/images/board/ic_LikeSelected.png";

export default function LikeButton({ liked, count, onClick }) {
  return (
    <Wrapper onClick={onClick}>
      <Icon src={liked ? LikeSelectedIcon : LikeDefaultIcon} alt="like" />
      <Count>{count}</Count>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Count = styled.span`
  font-size: 14px;
  margin-top: 4px;
  color: white;
`;