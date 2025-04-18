import React, { useState } from 'react';
import styled from 'styled-components';

export default function MainNav() {
  const [isBoardOpen, setIsBoardOpen] = useState(false); //게시판
  const [showSearch, setShowSearch] = useState(false); //검색창

  const toggleBoardMenu = () => {
    setIsBoardOpen((prev) => !prev); //게시판 메뉴 클릭 시 실행이유
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev); //검색창 보여줌과 숨김임~
  };

  const goToMyPage = () => {
    window.location.href = '/mypage'; //마이페이지 넘어가게
  };

  return (
    <NavWrapper>
      <NavContainer>
        <Logo>
          <img src="/assets/images/common/Logo_trend.png" alt="Logo Trendist" />
        </Logo>

        <NavMenu>
          <NavItem>글로벌 이슈</NavItem>
          <NavItem>활동</NavItem>
          <NavItem>랭킹</NavItem>

          <NavItem isActive={isBoardOpen} onClick={toggleBoardMenu}>
            게시판
            {isBoardOpen && (
              <Submenu>
                <li onClick={() => setIsBoardOpen(false)}>후기 게시판</li>
                <li onClick={() => setIsBoardOpen(false)}>자유 게시판</li>
              </Submenu>
            )}
          </NavItem>
        </NavMenu>

        <NavIcons>
          <IconButton onClick={toggleSearch}>
          <img src="/assets/images/nav/Vector.png" />
          </IconButton>
          <IconButton onClick={goToMyPage}>
          <img src="/assets/images/nav/mypage.png" />
          </IconButton>

          {showSearch && (
            <SearchContainer>
              <SearchInput type="text" placeholder="검색어를 입력하세요..." />
            </SearchContainer>
          )}
        </NavIcons>
      </NavContainer>
    </NavWrapper>
  );
}

const NavWrapper = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  box-sizing: border-box;
`;

const NavContainer = styled.nav`
  width: 1600px;
  padding: 0 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Logo = styled.div`
position: absolute;
  left: 40px;  
img {
    width: 200px;
    height: auto;
    object-fit: contain;

  }
`;

const NavMenu = styled.ul`
  display: flex;
  gap: 150px;
  list-style: none;
  position: relative;
`;

const NavItem = styled.li`
  position: relative;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${(props) => (props.isActive ? '#F6FAFF' : 'transparent')};
  transition: background-color 0.2s ease;
`;

const Submenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  list-style: none;
  padding: 8px 0;
  margin: 8px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

  li {
    padding: 8px 16px;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      background-color: #f4f4f4;
    }
  }
`;

const NavIcons = styled.div`
  display: flex;
  gap: 16px;
  position: relative;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
    img {
    width: 22px;   
    height: 22px;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 36px;
  right: 32px;
  z-index: 1000;
`;

const SearchInput = styled.input`
  padding: 8px 16px;
  font-size: 16px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;
