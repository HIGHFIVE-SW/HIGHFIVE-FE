import React from 'react';
import styled from 'styled-components';

const BoardSidebar = ({ selected, onSelect }) => {
  return (
    <Sidebar>
      <Title>게시판</Title>
      <Item
        active={selected === '후기 게시판'}
        onClick={() => onSelect('후기 게시판')}
      >
        후기 게시판
      </Item>
      <Item
        active={selected === '자유 게시판'}
        onClick={() => onSelect('자유 게시판')}
      >
        자유 게시판
      </Item>
    </Sidebar>
  );
};

export default BoardSidebar;

const Sidebar = styled.div`
  background-color: #235BA9;
  padding:24px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 127px; /* 상단 네비게이션 높이에 맞게 조정 */
`;

const Title = styled.h3`
  margin-bottom: 24px;
  font-size: 25px;
  font-weight: bold;
  color: #fff;
  text-align: center;
`;

const Item = styled.div`
  margin-bottom: 12px;
  cursor: pointer;
  color: #F9FBFF;
  font-size: 20px;
  text-align: center;
  padding: 8px 16px;
  border-radius: 8px;

  background-color: ${(props) => (props.active ? '#174B8A' : 'transparent')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};

  &:hover {
    font-weight: bold;
  }
`;
