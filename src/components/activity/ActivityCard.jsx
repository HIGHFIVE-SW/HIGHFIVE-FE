import React from 'react';
import styled from 'styled-components';
import BookmarkFilledButton from '../../assets/images/common/BookmarkFilledButton.png';
import BookmarkButton from '../../assets/images/common/BookmarkButton.png';


export default function ActivityCard({
  title,
  tags,
  image,
  date,
  bookmarked = false,
  onToggle,
  isClosed,
  siteUrl
}) {
  return (
    <CardLink
      href={siteUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      $disabled={!siteUrl}
      tabIndex={siteUrl ? 0 : -1}
      aria-disabled={!siteUrl}
      onClick={e => {
        if (!siteUrl) e.preventDefault();
      }}
    >
      <Card>
        <ImageWrapper>
          <IssueImage src={image} alt="활동 이미지" />
          {isClosed && <ClosedBadge>마감</ClosedBadge>}
          <BookmarkIcon
            src={bookmarked ? BookmarkFilledButton : BookmarkButton}
            alt="북마크"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onToggle) onToggle();
            }}
          />
        </ImageWrapper>
        <p className="activity-title">{title}</p>
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

const CardLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: inline-block;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};

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
  overflow: visible;
  padding: 0 20px;
  cursor: pointer;

  .activity-title {
    font-size: 23px;
    font-weight: bold;
    margin-top: 40px;
    margin-bottom: 10px;
    font-family: NotoSansCustom;
    word-break: keep-all;
    overflow: hidden; 
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 230px;
  position: relative;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: visible;
  left: -20px;
`;

const IssueImage = styled.img`
  width: 324px;
  height: 230px;
  object-fit: cover;
  object-position: top; 
  display: block;
`;

const BookmarkIcon = styled.img`
  position: absolute;
  bottom: -45.5px;
  right : -20px;
  width: 55px;
  height: 55px;
  cursor: pointer;
  z-index: 10;
`;

const Tags = styled.p`
  font-size: 18px;
  margin: 0;
  margin-top: auto;
  span {
    color: #235BA9;
    margin-right: 10px;
  }
`;

const DateText = styled.p`
  font-size: 15px;
  color: #808080;
  margin-top: 8px;
`;

const ClosedBadge = styled.div`
  position: absolute;
  top: 0px;
  left: -1px;
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
