import React, { useState } from 'react';
import styled from 'styled-components';
import logoTrend from '../assets/images/ic_ImageTextLogo.png';
import MypageIcon from '../assets/images/ic_Mypage.png';
import VectorIcon from '../assets/images/ic_Search.png';
import Search from '../components/search/Search';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MainNav() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  return (
    <NavWrapper>
      <Logo onClick={() => navigate('/main')}>
        <img src={logoTrend} alt="Trendist Logo" />
      </Logo>

      <NavMenu>
        <NavItem
          className={location.pathname === '/global-issue' ? 'active' : ''}
          onClick={() => navigate('/global-issue')}
        >
          글로벌 이슈
        </NavItem>
        <NavItem
          className={location.pathname === '/activity' ? 'active' : ''}
          onClick={() => navigate('/activity')}
        >
          활동
        </NavItem>
        <NavItem
          className={location.pathname === '/ranking' ? 'active' : ''}
          onClick={() => navigate('/ranking')}
        >
          랭킹
        </NavItem>
        <NavItem
          className={location.pathname === '/board' ? 'active' : ''}
          onClick={() => navigate('/board')}
        >
          게시판
        </NavItem>
      </NavMenu>

      <RightIcons>
        <Divider />
        <img src={MypageIcon} alt="User Icon" />
        <img src={VectorIcon} alt="Search Icon" onClick={toggleSearch} />
      </RightIcons>

      {showSearch && (
        <Search
          query={searchQuery}
          onChange={setSearchQuery}
          onClose={() => setShowSearch(false)}
        />
      )}
    </NavWrapper>
  );
}


const NavWrapper = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center; 
  padding: 0 32px;
  background-color: white;
  box-sizing: border-box;
  height: 64px;
 border-bottom: none; 
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

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
    background-color: #F6FAFF;
    padding: 6px 16px;
    border-radius: 24px 24px 0 0; 
    font-weight: 500;
  }
`;

const NavItem = styled.div`
  font-size: 20px;
  color: #111;
  cursor: pointer;
  padding: 6px 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 24px 24px 0 0;

  &.active {
    color: #235ba9;
    background-color: #F6FAFF;
    padding: 14px 35px 20px;
    border-radius: 20px 20px 0 0; 
    margin-bottom: -15px;
  }
`;

const RightIcons = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  img {
    height: 30px;
    cursor: pointer;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 30px;
  background-color: #000;
  margin-right: 20px;
`; 