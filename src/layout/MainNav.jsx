import React, { useState, useRef, useEffect } from 'react';
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        <DropdownWrapper ref={dropdownRef}>
          <NavItem
            className={location.pathname === '/board' ? 'active' : ''}
            onClick={() => setIsDropdownOpen(prev => !prev)}
          >
            게시판
          </NavItem>
          {isDropdownOpen && (
            <DropdownContent>
              <DropdownItem onClick={() => { navigate('/board/review'); setIsDropdownOpen(false); }}>
                후기게시판
              </DropdownItem>
              <DropdownItem onClick={() => { navigate('/board/free'); setIsDropdownOpen(false); }}>
                자유게시판
              </DropdownItem>
            </DropdownContent>
          )}
        </DropdownWrapper>
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

// ================= Styled Components =================

const NavWrapper = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  background-color: white;
  box-sizing: border-box;
  height: 64px;
<<<<<<< HEAD
 border-bottom: none; 
=======
>>>>>>> develop
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
  gap: 60px;
  align-items: center;
`;

const NavItem = styled.div`
  font-size: 18px;
  color: #111;
  cursor: pointer;
  padding: 6px 12px;
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

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  position: absolute;
  background-color: white;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  top: 48px;
  z-index: 1000;
  border-radius: 8px;
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  color: #111;
  white-space: nowrap;

  &:hover {
    background-color: #235BA9;
    color: #fff;
    border-radius: 8px;
  }
`;

const RightIcons = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  img {
    height: 24px;
    cursor: pointer;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 30px;
  background-color: #000;
  margin-right: 20px;
`;
