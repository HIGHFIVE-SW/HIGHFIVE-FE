import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export default function ActivityCard({ title, tags, image, date, bookmarked, onToggle, isClosed }) {
  const destination = getLinkFromTags(tags); //  자동 링크 결정

  return (
    <CardLink to={destination}>
      <Card>
        <ImageWrapper>
          <IssueImage src={image} alt="이슈 이미지" />
          {isClosed && <ClosedBadge>마감</ClosedBadge>}
          <BookmarkIcon
            src={bookmarked
              ? require('../../assets/images/main/BookmarkFilledButton.png')
              : require('../../assets/images/main/BookmarkButton.png')}
            alt="북마크"
            onClick={(e) => {
              e.preventDefault(); // 링크 이동 방지
              onToggle();
            }}
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
    </CardLink>
  );
}

// ✅ 태그에 따라 이동할 링크 결정
function getLinkFromTags(tags) {
  const allTags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(' ') : [];

  if (allTags.includes('#봉사활동')) return '/activity/volunteer';
  if (allTags.includes('#인턴십')) return '/activity/internship';
  if (allTags.includes('#공모전')) return '/activity/contest';
  if (allTags.includes('#서포터즈')) return '/activity/supporters';

  return '/activity/preview';
}

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-block;

  &:hover {
    opacity: 0.9;
  }
`;

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
  cursor: pointer;

  .issue-title {
    font-size: 23px;
    font-weight: bold;
    margin-top: 50px;
    margin-bottom: 10px;
    font-family: NotoSansCustom;

  height: 60px; 
  overflow: hidden; 
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄 */
  -webkit-box-orient: vertical;
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

const ClosedBadge = styled.div`
  position: absolute;
  top: 0px;
  left: -20px;
  background-color: #656565;
  color: white;
  font-size: 15px;
  padding: 8px 20px;
  z-index: 20;
  font-family: 'NotoSansCustom';

  display: flex;
  align-items: center;
  justify-content: center;
`;