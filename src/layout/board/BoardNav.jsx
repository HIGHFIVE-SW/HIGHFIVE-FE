import React from "react";
import styled from "styled-components";
import backIcon from "../../assets/images/nav/ic_Back.png";
import searchIcon from "../../assets/images/nav/ic_Search.png";
import trendistLogo from "../../assets/images/nav/ImageTextLogo.png";


const BoardNav = () => {
  return (
    <NavBar>
      <IconButton>
        <IconImg src={backIcon} alt="뒤로가기" />
      </IconButton>

      <Center>
        <LogoImg src={trendistLogo} alt="Trendist 로고" />
      </Center>

      <IconButton>
        <IconImg src={searchIcon} alt="검색" />
      </IconButton>
    </NavBar>
  );
};

export default BoardNav; ;


const NavBar = styled.div`
  width: 100vw;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  background-color: white;
  box-sizing: border-box;
  height: 64px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const IconImg = styled.img`
  width: 24px;
  height: 24px;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LogoImg = styled.img`
  height: 100px;
`;
