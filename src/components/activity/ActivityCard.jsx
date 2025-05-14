import React from 'react';
import styled from 'styled-components';


export default function ActivityCard({ title, tags, image, date, bookmarked, onToggle }) {
    const insertLineBreak = (text) => {
      const keywords = ['공모전', '봉사활동', '서포터즈', '인턴십'];
      let result = text;
      keywords.forEach((word) => {
        result = result.replace(word, `\n${word}`);
      });
      return result;
    };
  
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
        <p className="issue-title">
          {insertLineBreak(title).split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <Tags>
        {tags.split(' ').map((t, idx) => (
          <span key={idx}>{t}</span>
        ))}
      </Tags>
        <DateText>{date}</DateText>
      </Card>
    );
  }
  

const Card = styled.div`
  width: 405px;
  height: 514px;
  border: 3px solid #235BA9;
  background-color: #fff;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: visible;

  .issue-title {
    font-size: 33px;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 10px;
    font-family: NotoSansCustom;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 288px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: visible;
`;

const IssueImage = styled.img`
  width: 399px;
  height: 288px;
  object-fit: cover;
  display: block;
`;

const BookmarkIcon = styled.img`
  position: absolute;
  bottom: -32px;
  right: 15px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 10;
`;

const Tags = styled.p`
  font-size: 20px;
  margin: 0 0 4px 0;
  white-space: pre-line;

  span {
    color: #235BA9;
    margin-right: 4px;
  }
`;

const DateText = styled.p`
  font-size: 18px;
  color: #808080;
  margin: 0;
`;