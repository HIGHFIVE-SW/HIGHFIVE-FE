import React from 'react';
import styled from 'styled-components';

export default function IssueCard({ title, tag, image, bookmarked, onToggle }) { 
    return (
    <Card>
      <ImageWrapper>
        <IssueImage src={image} alt="이슈 이미지" />
        <BookmarkIcon
          src={bookmarked ? require('../assets/images/main/BookmarkFilledButton.png') : require('../assets/images/main/BookmarkButton.png')}
          alt="북마크"
          onClick={onToggle}
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
  text-align: left;
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
  }

  .issue-tag {
    font-size: 20px;
    color: #555;
    margin-top: 10px;
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
  bottom: -33px;
  right: 5px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 10;
`;
