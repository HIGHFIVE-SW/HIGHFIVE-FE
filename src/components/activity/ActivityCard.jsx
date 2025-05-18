import React from 'react';
import styled from 'styled-components';


export default function ActivityCard({ title, tags, image, date, bookmarked, onToggle }) {
     
    return (
      <Card>
        <ImageWrapper>
          <IssueImage src={image} alt="이슈 이미지" />
          <BookmarkIcon
            src={bookmarked
              ? require('../../assets/images/main/BookmarkFilledButton.png')
              : require('../../assets/images/main/BookmarkButton.png')}
            alt="북마크"
            onClick={onToggle}
          />
        </ImageWrapper>
        <p className="issue-title">{title}</p>
        <Tags>
          {Array.isArray(tags)
            ? tags.map((t, idx) => <span key={idx}>{t}</span>)
            : typeof tags === 'string'
            ? tags.split(' ').map((t, idx) => <span key={idx}>{t}</span>)
            : null}
        </Tags>
        <DateText>{date}</DateText>
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
  padding: 0 20px;

  .issue-title {
    font-size: 23px;
    font-weight: bold;
    margin-top: 50px;
    margin-bottom: 10px;
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
  right: 5px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  z-index: 10;
`;

const Tags = styled.p`
  font-size: 18px;
  margin: 0 0 4px 0;
  white-space: pre-line;

  span {
    color: #235BA9;
    margin-right: 10px;
  }
`;

const DateText = styled.p`
  font-size: 15px;
  color: #808080;
  margin: 0;
`;