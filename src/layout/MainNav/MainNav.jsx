import React from 'react';
import styled from 'styled-components';
import logoTrend from '../../assets/images/Logo_trend.png';
import MypageIcon from '../../assets/images/mypage.png';
import VectorIcon from '../../assets/images/Vector.png';




export default function MainNav() {
  return (
    <NavWrapper>
      <Logo>
        <img src={logoTrend} alt="Trendist Logo" />
      </Logo>

      <NavMenu>
        <NavItem>글로벌 이슈</NavItem>
        <NavItem>활동</NavItem>
        <NavItem>랭킹</NavItem>
        <NavItem>게시판</NavItem>
      </NavMenu>

      <RightIcons>
        <img src={MypageIcon} alt="User Icon" />
        <img src={VectorIcon} alt="Search Icon" />
      </RightIcons>
    </NavWrapper>
  );
}

const NavWrapper = styled.nav`
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  background-color: white;
  box-sizing: border-box;
  height: 64px;
  border-bottom: 1px solid #ddd;
`;

const Logo = styled.div`
  img {
    height: 100px;
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 180px;
  align-items: center;

  .active {
    color: #235ba9;
    font-weight: bold;
    background-color: #f0f6ff;
    padding: 6px 12px;
    border-radius: 10px;
  }
`;

const NavItem = styled.div`
  font-size: 20px;
  color: #111;
  cursor: pointer;
`;

const RightIcons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  img {
    height: 30px;
    cursor: pointer;
  }
`;
