import React from 'react';
import styled from 'styled-components';

export default function IssueCard({ title, tag, image, bookmarked, onToggle, onClick }) { 
    return (
      <Card onClick={onClick}>
      <ImageWrapper>
        <IssueImage src={image} alt="이슈 이미지" />
        <BookmarkIcon
          src={bookmarked ? require('../assets/images/main/BookmarkFilledButton.png') : require('../assets/images/main/BookmarkButton.png')}
          alt="북마크"
          onClick={(e) => {
            e.stopPropagation(); 
            onToggle();
          }}
        />
      </ImageWrapper>
      <p className="issue-title">{title}</p>
      <span className="issue-tag">{tag}</span>
    </Card>
  );
}

const Card = styled.div`
  width: 330px;
  height: 430px;
  border: 3px solid #235BA9;
  background-color: #fff;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: visible;

  .issue-title {
    font-size: 28px;
    font-weight: bold;
    margin-top: 50px;
    font-family: NotoSansCustom;
    padding: 0 20px;
  }

  .issue-tag {
    font-size: 20px;
    color: #555;
    margin-top: -20px;
    font-family: NotoSansCustom;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 230px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: visible;
`;

const IssueImage = styled.img`
  width: 325px;
  height: 230px;
  object-fit: cover;
  display: block;
`;

const BookmarkIcon = styled.img`
  position: absolute;
  bottom: -50px;
  right: 8px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  z-index: 10;
`;
