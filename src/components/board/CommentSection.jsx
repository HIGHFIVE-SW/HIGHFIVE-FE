import React, { useState } from "react";
import styled from "styled-components";
import PROFILE_IMG from "../../assets/images/profile/DefaultProfile.png";

export default function CommentSection({
  comments,
  comment,
  setComment,
  setComments,
  handleCommentSubmit,
  handleEditComment,
  handleDeleteComment,
  editingCommentId,
  setEditingCommentId
}) {
  // 프로필 이미지 에러 상태 관리
  const [profileImageErrors, setProfileImageErrors] = useState({});

  // 프로필 이미지 에러 처리 함수
  const handleProfileImageError = (commentId) => {
    setProfileImageErrors(prev => ({
      ...prev,
      [commentId]: true
    }));
  };

  // 프로필 이미지 URL 결정 함수
  const getProfileImageSrc = (comment) => {
    if (profileImageErrors[comment.commentId]) {
      return PROFILE_IMG; // 에러 발생 시 기본 이미지
    }
    
    if (!comment.profileUrl || comment.profileUrl === "기본값" || comment.profileUrl === "") {
      return PROFILE_IMG; // 프로필 URL이 없거나 기본값인 경우
    }
    
    return comment.profileUrl; // 유효한 프로필 URL
  };

  return (
    <CommentSectionWrapper>
      <CommentTitle>댓글</CommentTitle>
      <CommentList>
        {comments.map((c) => (
          <CommentItem key={c.commentId}>
            <CommentLeft>
              <CommentAuthorBox>
                <CommentProfileImg               
                  src={getProfileImageSrc(c)}
                  alt="프로필 이미지"
                  onError={() => handleProfileImageError(c.commentId)}
                />
                <CommentAuthor>{c.nickname}</CommentAuthor>
              </CommentAuthorBox>
              <CommentText>{c.content}</CommentText>
            </CommentLeft>
            <CommentRight>
              {c.userId === localStorage.getItem('userId') && (
                editingCommentId === c.commentId ? (
                  <EditingText>수정 중</EditingText>
                ) : (
                  <CommentActions>
                    <ActionBtn onClick={() => handleEditComment(c.commentId)}>
                      수정
                    </ActionBtn>
                    <ActionDivider />
                    <ActionBtn onClick={() => handleDeleteComment(c.commentId)}>
                      삭제
                    </ActionBtn>
                  </CommentActions>
                )
              )}
              <CommentCreateAt>{c.createdAt?.slice(0, 10).replace(/-/g, ".")}</CommentCreateAt>
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
        {editingCommentId ? (
          <>
            <CommentButton type="submit">완료</CommentButton>
            <CancelEditButton type="button" onClick={() => {
              setEditingCommentId(null);
              setComment("");
            }}>
              취소
            </CancelEditButton>
          </>
        ) : (
          <CommentButton type="submit">등록</CommentButton>
        )}
      </CommentForm>
    </CommentSectionWrapper>
  );
}

// 스타일드 컴포넌트들은 동일하게 유지
const CommentSectionWrapper = styled.div`
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

const EditingText = styled.span`
  color: #e67e22;
  font-size: 13px;
  font-weight: 600;
  margin-right: 8px;
`;

const CancelEditButton = styled.button`
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 15px;
  margin-left: 6px;
  cursor: pointer;
  height: 36px;
  &:hover {
    background: #e0e0e0;
  }
`;
