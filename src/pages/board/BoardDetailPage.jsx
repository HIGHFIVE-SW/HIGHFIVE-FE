// src/pages/BoardDetailPage.jsx

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Footer from "../../layout/Footer";
import BoardNav from "../../layout/board/BoardNav";
import useLike from "../../hooks/useLike";
import PROFILE_IMG from "../../assets/images/profile/DefaultProfile.png";
import SAMPLE_AWARD_IMG from "../../assets/images/board/SampleReviewImg.png";
import ArrowDownIcon from "../../assets/images/common/ic_ArrowDown.png";

// 더미 데이터 예시
const post = {
  boardType: "후기 게시판",
  title: "국제수면산업박람회 아이디어 공모전 후기!",
  tags: ["#환경", "#공모전"],
  author: "나",
  createAt: "2025.03.25",
  content: `국제수면산업 박람회에 참가해서 영예의 대상을 수상했어요!
새롭고 흥미로운 아이디어를 나눌 수 있어서 정말 즐거운 경험이었습니다.

좋은 사람들과 함께한 뜻깊은 시간이었고, 서로의 아이디어를 존중하며 소통할 수 있었던 현장이었어요.
다양한 분야의 전문가들과 인사이트를 주고받으며, 수면산업의 무한한 가능성을 다시 느낄 수 있었고요.

이번 수상을 통해 저희의 아이디어가 의미 있는 방향으로 나아가고 있다는 확신도 얻게 되었어요.

앞으로도 더 많은 사람들의 삶에 긍정적인 영향을 줄 수 있도록, 꾸준히 연구하고 도전해 나가겠습니다!

다시 한 번, 함께해주신 모든 분들께 감사드려요.✨`,
  image: SAMPLE_AWARD_IMG,
  likeCount: 3,
  isVerified: true,
  comments: [
    { id: 1, author: "JUDY", content: "역시 새벽형 주디답네요 👍", createAt: "2025.04.21" },
    { id: 2, author: "JUDY", content: "감사합니다!", createAt: "2025.04.21" },
    { id: 3, author: "나", content: "내가 쓴 댓글!", createAt: "2025.04.22" },
  ],
};

export default function BoardDetailPage() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const { liked, count: likeCount, toggleLike } = useLike(post.likeCount);
  const [showComments, setShowComments] = useState(true);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowPostMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: "나",
        content: comment,
        createAt: "2025.04.21",
      },
    ]);
    setComment("");
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleEditComment = (id) => {
    const target = comments.find((c) => c.id === id);
    if (target) {
      setComment(target.content);
      setComments(comments.filter((c) => c.id !== id));
    }
  };

  return (
    <>
      <BoardNav />
      <Wrapper>
        <BoardTypeRow>
          <BoardType>{post.boardType}</BoardType>
          {post.author === "나" && (
            <PostMenuWrapper ref={menuRef}>
              <MenuButton onClick={() => setShowPostMenu((prev) => !prev)}>
                <MenuDot />
                <MenuDot />
                <MenuDot />
              </MenuButton>
              {showPostMenu && (
                <DropdownMenu>
                  <DropdownItem onClick={() => setShowPostMenu(false)}>
                    수정
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={() => setShowPostMenu(false)}>
                    삭제
                  </DropdownItem>
                </DropdownMenu>
              )}
            </PostMenuWrapper>
          )}
        </BoardTypeRow>

        <TitleRow>
          <Title>{post.title}</Title>
        </TitleRow>

        <TagList>
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagList>

        <InfoRow>
          <AuthorBox>
            <ProfileImg src={PROFILE_IMG} alt="프로필" />
            <Author>{post.author}</Author>
          </AuthorBox>
          <CreateAtText>{post.createAt}</CreateAtText>
        </InfoRow>

        {post.isVerified && (
          <ConfirmationText>
            *이 글은 1차 검증이 완료된 글입니다.
          </ConfirmationText>
        )}

        <Divider />

        <ImageBox>
          <img src={post.image} alt="수상 사진" />
        </ImageBox>

        <Content>{post.content}</Content>

        <Divider />

        <ButtonRow>
          <LikeBtn onClick={toggleLike} $liked={liked}>
            <LikeIcon
              viewBox="0 0 24 24"
              fill={liked ? "#e74c3c" : "none"}
              stroke="#e74c3c"
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </LikeIcon>
            <LikeText>추천</LikeText>
            <LikeCount>{likeCount}</LikeCount>
          </LikeBtn>
          <CommentBtn onClick={() => setShowComments((prev) => !prev)}>
            <CommentIcon
              viewBox="0 0 24 24"
              fill="none"
              stroke="#222"
              strokeWidth="2"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 9h10M7 13h6" />
            </CommentIcon>
            <LikeText>댓글</LikeText>
            <ArrowIcon src={ArrowDownIcon} alt="화살표" $open={showComments} />
          </CommentBtn>
        </ButtonRow>

        {showComments && (
          <CommentSection>
            <CommentTitle>댓글</CommentTitle>
            <CommentList>
              {comments.map((c) => (
                <CommentItem key={c.id}>
                  <CommentLeft>
                    <CommentAuthorBox>
                      <CommentProfileImg src={PROFILE_IMG} alt="프로필" />
                      <CommentAuthor>{c.author}</CommentAuthor>
                    </CommentAuthorBox>
                    <CommentText>{c.content}</CommentText>
                  </CommentLeft>
                  <CommentRight>
                    {c.author === "나" && (
                      <CommentActions>
                        <ActionBtn onClick={() => handleEditComment(c.id)}>
                          수정
                        </ActionBtn>
                        <ActionDivider />
                        <ActionBtn onClick={() => handleDeleteComment(c.id)}>
                          삭제
                        </ActionBtn>
                      </CommentActions>
                    )}
                    <CommentCreateAt>{c.createAt}</CommentCreateAt>
                  </CommentRight>
                </CommentItem>
              ))}
            </CommentList>
            <CommentForm onSubmit={handleCommentSubmit}>
              <CommentInput
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요."
              />
              <CommentButton type="submit">등록</CommentButton>
            </CommentForm>
          </CommentSection>
        )}
      </Wrapper>
      <Footer />
    </>
  );
}

const Wrapper = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 32px 16px;
  background: #fff;
`;

const BoardTypeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const BoardType = styled.div`
  font-size: 15px;
  color: #999999;
  font-weight: 680;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
`;

const PostMenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const MenuDot = styled.span`
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #222;
  margin: 2px 0;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 32px;
  right: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 65px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const DropdownItem = styled.button`
  background: none;
  border: none;
  width: 100%;
  padding: 12px 0;
  font-size: 14px;
  color: #222;
  text-align: center;
  cursor: pointer;
  font-family: inherit;
  &:hover {
    background: #f6f6f6;
  }
`;

const DropdownDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #d9d9d9;
`;

const TagList = styled.div`
  margin-bottom: 12px;
`;

const Tag = styled.span`
  color: #235ba9;
  font-size: 14px;
  margin-right: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const AuthorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 0.1px solid #c4c4c4;
`;

const Author = styled.span`
  font-size: 15px;
  color: #000;
  font-weight: 600;
`;

const CreateAtText = styled.span`
  font-size: 13px;
  color: #000;
`;

const ConfirmationText = styled.div`
  font-size: 12px;
  color: #34a853;
  font-weight: 500;
  margin-bottom: 12px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid #d9d9d9;
  margin: 24px 0;
`;

const ImageBox = styled.div`
  width: 100%;
  margin: 24px 0;
  text-align: center;
  img {
    max-width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const Content = styled.div`
  font-size: 17px;
  line-height: 1.8;
  color: #222;
  white-space: pre-line;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`;

const LikeBtn = styled.button`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 7px;
  padding: 4px 12px;
  gap: 4px;
  cursor: pointer;
  font-size: 13px;
  min-width: 70px;
  height: 36px;
  transition: border 0.2s;
  &:hover {
    border: 1.5px solid #e74c3c;
  }
`;

const LikeIcon = styled.svg`
  width: 17px;
  height: 17px;
`;

const LikeText = styled.span`
  color: #000;
  font-weight: 500;
  font-size: 13px;
`;

const LikeCount = styled.span`
  color: #222;
  font-size: 13px;
  margin-left: 2px;
`;

const CommentBtn = styled.button`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 7px;
  padding: 4px 12px;
  gap: 4px;
  cursor: pointer;
  font-size: 13px;
  min-width: 70px;
  height: 36px;
  transition: border 0.2s;
  &:hover {
    border: 1.5px solid #222;
  }
`;

const CommentIcon = styled.svg`
  width: 17px;
  height: 17px;
`;

const ArrowIcon = styled.img`
  width: 12px;
  margin-left: 4px;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease;
`;

const CommentSection = styled.div`
  margin-top: 24px;
`;

const CommentTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
`;

const CommentItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
`;

const CommentLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentAuthorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`;

const CommentProfileImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 0.1px solid #c4c4c4;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: #000;
  font-size: 14px;
`;

const CommentText = styled.span`
  font-size: 15px;
  color: #222;
  margin-left: 32px;
`;

const CommentRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const CommentCreateAt = styled.span`
  font-size: 12px;
  color: #aaa;
`;

const CommentActions = styled.div`
  display: flex;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-right: -8px;
  margin-bottom: 3px;
`;

const ActionDivider = styled.div`
  width: 1px;
  background: #e0e0e0;
  margin: 4px 0;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 12px;
  color: #235ba9;
  cursor: pointer;
  flex: 1;
  &:hover {
    background: #f6f6f6;
  }
`;

const CommentForm = styled.form`
  display: flex;
  gap: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1.5px solid #235ba9;
  border-radius: 6px;
  font-size: 15px;
`;

const CommentButton = styled.button`
  background: #235ba9;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0 18px;
  font-size: 15px;
  cursor: pointer;
`;
