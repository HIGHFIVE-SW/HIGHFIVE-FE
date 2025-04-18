import React from 'react';
import styled from 'styled-components';

const GlobalCategory = () => {
  const categories = [
    { title: '환경', img: '/assets/images/environment.png' },
    { title: '사람과 사회', img: '/assets/images/people.png' },
    { title: '경제', img: '/assets/images/economy.png' },
    { title: '기술', img: '/assets/images/tech.png' },
  ];

  return (
    <Wrapper>
      <Title>글로벌 이슈</Title>
      <Subtitle>관심있는 분야의 이슈를 알아보기!</Subtitle>
      <CategoryList>
        {categories.map((item, index) => (
          <Category key={index}>
            <img src={item.img} alt={item.title} />
            <p>{item.title}</p>
          </Category>
        ))}
      </CategoryList>
    </Wrapper>
  );
};

export default GlobalCategory;

const Wrapper = styled.section`
  width: 100%;
  max-width: 1600px;
  margin: 60px auto;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 50px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 40px;
  color: #666;
  margin: 10px 0 32px;
`;

const CategoryList = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;
  flex-wrap: wrap;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 30px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
    
  img {
    width: 305px;
    height: 344px;
    margin-bottom: 8px;
  }
`;