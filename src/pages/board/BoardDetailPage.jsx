import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Footer from "../../layout/Footer";
import BoardNav from "../../layout/board/BoardNav";
import PROFILE_IMG from "../../assets/images/profile/DefaultProfile.png";
import ArrowDownIcon from "../../assets/images/common/ic_ArrowDown.png";
import { useParams, useNavigate } from "react-router-dom";
import { usePost, useTogglePostLike, useReview, useToggleReviewLike } from "../../query/usePost";
import { deletePost, deleteReview, getComments, postComment, updateComment, deleteComment } from "../../api/PostApi";
import { useQueryClient } from '@tanstack/react-query';
import CommentSection from '../../components/board/CommentSection';
import { useReviewLikeStore } from "../../store/reviewLikeStore";

export default function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(true);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const menuRef = useRef(null);

  // 게시물 데이터 가져오기 (자유게시판/리뷰게시판 구분)
  const isReview = window.location.pathname.includes('/board/review/');
  const { 
    data: postData, 
    isLoading: isPostLoading, 
    isError: isPostError, 
    error: postError 
  } = usePost(isReview ? null : id);

  const {
    data: reviewData,
    isLoading: isReviewLoading,
    isError: isReviewError,
    error: reviewError
  } = useReview(isReview ? id : null);

  const isLoading = isReview ? isReviewLoading : isPostLoading;
  const isError = isReview ? isReviewError : isPostError;
  const error = isReview ? reviewError : postError;
  const data = isReview ? reviewData : postData?.result;

  // 좋아요 토글 훅
  const togglePostLikeMutation = useTogglePostLike();
  const toggleReviewLikeMutation = useToggleReviewLike();

  // Zustand 스토어에서 후기 좋아요 상태 관리 함수들 가져오기
  const { likeMap, setLike, updateLike } = useReviewLikeStore();

  // 자유 게시판용 localStorage 기반 좋아요 상태 관리
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 후기 게시판용 Zustand 기반 좋아요 상태
  const reviewLikeState = isReview ? (likeMap[id] || { liked: false, likeCount: 0 }) : null;

  // 자유 게시판: localStorage에서 하트 상태 불러오기
  useEffect(() => {
    if (!isReview && id) {
      const savedLikeState = localStorage.getItem(`heart-${id}`);
      if (savedLikeState) {
        setLiked(JSON.parse(savedLikeState));
      }
    }
  }, [id, isReview]);

  // 자유 게시판: 하트 상태 변경 시 localStorage에 저장
  useEffect(() => {
    if (!isReview && id) {
      localStorage.setItem(`heart-${id}`, JSON.stringify(liked));
    }
  }, [liked, id, isReview]);

  // 게시물 데이터가 로드되면 좋아요 상태 설정
  useEffect(() => {
    if (data && id) {
      if (isReview) {
        // 후기 게시판: Zustand 스토어에 초기 상태 설정 (이미 스토어에 있는 상태가 우선)
        const existingState = likeMap[id];
        if (!existingState) {
          console.log('후기 상세페이지 초기 좋아요 상태 설정:', {
            id,
            liked: data.liked || false,
            likeCount: data.likeCount || 0
          });
          setLike(id, data.liked || false, data.likeCount || 0);
        }
      } else {
        // 자유 게시판: 좋아요 개수만 설정
        setLikeCount(data.likeCount || 0);
      }
    }
  }, [data, isReview, id, setLike, likeMap]);

  // 프로필 이미지 에러 처리 함수
  const handleProfileImageError = () => {
    setProfileImageError(true);
  };

  // 프로필 이미지 URL 결정 함수
  const getProfileImageSrc = (post) => {
    if (profileImageError) {
      return PROFILE_IMG;
    }
    
    if (!post.profileUrl || post.profileUrl === "기본값" || post.profileUrl === "") {
      return PROFILE_IMG;
    }
    
    return post.profileUrl;
  };

  const handleToggleLike = async () => {
    if (isReview) {
      // 후기 게시판: Zustand 기반 좋아요 처리
      const currentState = reviewLikeState;
      
      console.log('상세페이지 후기 좋아요 클릭:', {
        id,
        currentState,
        liked: currentState?.liked,
        likeCount: currentState?.likeCount
      });
      
      try {
        // 1. 즉시 UI 업데이트 (Optimistic Update)
        const newLiked = !currentState.liked;
        const newCount = currentState.likeCount + (newLiked ? 1 : -1);
        
        console.log('상세페이지 Optimistic Update:', { newLiked, newCount });
        updateLike(id, newLiked, newCount);
        
        // 2. 서버 요청
        const result = await toggleReviewLikeMutation.mutateAsync(id);
        
        // 3. 서버 응답으로 정확한 상태 동기화
        const serverLiked = result.liked ?? result.like ?? newLiked;
        const serverCount = result.likeCount ?? newCount;
        
        console.log('상세페이지 서버 응답 동기화:', {
          result,
          serverLiked,
          serverCount
        });
        
        updateLike(id, serverLiked, serverCount);
        
        // 4. React Query 캐시 업데이트 (상세 페이지와 동기화)
        queryClient.setQueryData(['review', id], (oldData) => {
          if (oldData?.result) {
            return {
              ...oldData,
              result: {
                ...oldData.result,
                liked: serverLiked,
                likeCount: serverCount
              }
            };
          } else if (oldData) {
            // 상세 페이지 데이터가 직접 저장된 경우
            return {
              ...oldData,
              liked: serverLiked,
              likeCount: serverCount
            };
          }
          return oldData;
        });

        // 5. 리뷰 리스트 캐시도 업데이트
        queryClient.setQueriesData(
          { queryKey: ['reviews'] },
          (oldData) => {
            if (oldData?.result?.content) {
              return {
                ...oldData,
                result: {
                  ...oldData.result,
                  content: oldData.result.content.map(review =>
                    review.id === id
                      ? { ...review, liked: serverLiked, likeCount: serverCount }
                      : review
                  )
                }
              };
            }
            return oldData;
          }
        );
        
      } catch (error) {
        // 실패 시 이전 상태로 롤백
        updateLike(id, currentState.liked, currentState.likeCount);
        console.error('후기 좋아요 처리 실패:', error);
      }
    } else {
      // 자유 게시판: localStorage 기반 좋아요 처리 (기존 방식 유지)
      const currentState = { liked, likeCount };
      
      // 하트 상태만 즉시 토글
      setLiked(!liked);

      try {
        // 서버 요청
        const result = await togglePostLikeMutation.mutateAsync(id);
        
        // 서버에서 받은 좋아요 수로 업데이트 (하트 상태는 유지)
        if (result && typeof result.likeCount !== 'undefined') {
          setLikeCount(result.likeCount);
        }
      } catch (error) {
        // 실패 시 하트 상태만 되돌리기
        setLiked(currentState.liked);
        console.error('자유게시판 좋아요 처리 실패:', error);
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowPostMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    // 댓글 불러오기
    const fetchComments = async () => {
      try {
        const commentList = await getComments(id);
        setComments(commentList);
      } catch (e) {
        setComments([]);
      }
    };
    if (id) fetchComments();
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [id]);

  // 댓글 수정 상태 관리
  const [editingCommentId, setEditingCommentId] = useState(null);

  // 댓글 수정 핸들러
  const handleEditComment = async (commentId) => {
    if (editingCommentId && editingCommentId !== commentId) return;
    const target = comments.find((c) => c.commentId === commentId);
    if (target) {
      setEditingCommentId(commentId);
      setComment(target.content);
    }
  };

  // 댓글 폼 제출 시(수정/등록 분기)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      if (editingCommentId) {
        await updateComment(editingCommentId, comment);
        setEditingCommentId(null);
      } else {
        await postComment(id, comment);
      }
      const commentList = await getComments(id);
      setComments(commentList);
      setComment("");
    } catch (error) {
      alert(error.message || '댓글 처리에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteComment(commentId);
      const commentList = await getComments(id);
      setComments(commentList);
    } catch (error) {
      alert(error.message || '댓글 삭제에 실패했습니다.');
    }
  };

  // 게시물 삭제 함수
  const handleDeletePost = async () => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      try {
        if (isReview) {
          await deleteReview(id);
        } else {
          await deletePost(id);
        }
        
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['post', id]);
        if (isReview) {
          queryClient.invalidateQueries(['reviews']);
          queryClient.invalidateQueries(['review', id]);
        }
        
        alert('게시물이 삭제되었습니다.');
        navigate(isReview ? '/board/review' : '/board/free');
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('게시물 삭제에 실패했습니다.');
      }
    }
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <>
        <BoardNav />
        <Wrapper>
          <LoadingMessage>게시물을 불러오는 중...</LoadingMessage>
        </Wrapper>
        <Footer />
      </>
    );
  }

  // 에러 발생 시
  if (isError) {
    return (
      <>
        <BoardNav />
        <Wrapper>
          <ErrorMessage>
            게시물을 불러오는데 실패했습니다: {error?.message}
          </ErrorMessage>
        </Wrapper>
        <Footer />
      </>
    );
  }

  // 게시물이 없을 때
  if (!data) {
    return (
      <>
        <BoardNav />
        <Wrapper>
          <ErrorMessage>게시물을 찾을 수 없습니다.</ErrorMessage>
        </Wrapper>
        <Footer />
      </>
    );
  }

  return (
    <>
      <BoardNav />
      <Wrapper>
        <BoardTypeRow>
          <BoardType>{isReview ? '후기 게시판' : '자유 게시판'}</BoardType>
          {String(data.userId) === String(localStorage.getItem('userId')) && (
            <PostMenuWrapper ref={menuRef}>
              <MenuButton onClick={() => setShowPostMenu((prev) => !prev)}>
                <MenuDot />
                <MenuDot />
                <MenuDot />
              </MenuButton>
              {showPostMenu && (
                <DropdownMenu>
                  <DropdownItem onClick={() => {
                    setShowPostMenu(false);
                    navigate(`/board/${isReview ? 'review/edit' : 'edit'}/${id}`);
                  }}>
                    수정
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={() => {
                    setShowPostMenu(false);
                    handleDeletePost();
                  }}>
                    삭제
                  </DropdownItem>
                </DropdownMenu>
              )}
            </PostMenuWrapper>
          )}
        </BoardTypeRow>

        <TitleRow>
          <Title>{data.title}</Title>
        </TitleRow>
        
          <TagList>
            {[data.keyword, data.activityType].filter(Boolean).map((tag) => (
              <Tag key={tag}>#{tag}</Tag>
            ))}
          </TagList>

        <InfoRow>
          <AuthorBox>
            <ProfileImg 
              src={getProfileImageSrc(data)}
              alt="프로필 이미지"
              onError={handleProfileImageError}
            />
            <Author>{data.nickname}</Author>
          </AuthorBox>
          <CreateAtText>
            {data.createdAt ? 
              new Date(data.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\./g, '.').replace(/\s/g, '') 
              : ''
            }
          </CreateAtText>
        </InfoRow>

        {isReview && data && data.ocrResult === true && (
          <ConfirmationText>
            *이 글은 1차 검증이 완료된 글입니다.
          </ConfirmationText>
        )}

        <Divider />

        <Content>
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
          {isReview && data.imageUrls && data.imageUrls.length > 0 && !data.content.includes('<img') && (
            <ImageGrid>
              {data.imageUrls.map((imageUrl, index) => (
                <ReviewImage key={index} src={imageUrl} alt={`리뷰 이미지 ${index + 1}`} />
              ))}
            </ImageGrid>
          )}
        </Content>

        <Divider />

        <ButtonRow>
          <LikeBtn 
            onClick={handleToggleLike} 
            $liked={isReview ? reviewLikeState?.liked : liked} 
            disabled={toggleReviewLikeMutation.isPending || togglePostLikeMutation.isPending}
          >
            <LikeIcon
              viewBox="0 0 24 24"
              fill={(isReview ? reviewLikeState?.liked : liked) ? "#e74c3c" : "none"}
              stroke="#e74c3c"
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </LikeIcon>
            <LikeText>추천</LikeText>
            <LikeCount>{isReview ? reviewLikeState?.likeCount : likeCount}</LikeCount>
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
          <CommentSection
            comments={comments}
            comment={comment}
            setComment={setComment}
            setComments={setComments}
            handleCommentSubmit={handleCommentSubmit}
            handleEditComment={handleEditComment}
            handleDeleteComment={handleDeleteComment}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
          />
        )}
      </Wrapper>
      <Footer />
    </>
  );
}

// 스타일 컴포넌트들은 기존과 동일...
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

const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid #d9d9d9;
  margin: 24px 0;
`;

const Content = styled.div`
  font-size: 17px;
  line-height: 1.8;
  color: #222;
  white-space: pre-line;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
  }
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
  
  &:hover:not(:disabled) {
    border: 1.5px solid #e74c3c;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #ff4444;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const ReviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const ConfirmationText = styled.div`
  font-size: 12px;
  color: #34a853;
  font-weight: 500;
  margin-bottom: 12px;
`;

const TagList = styled.div`
  margin-bottom: 22px;
`;

const Tag = styled.span`
  color: #235ba9;
  font-size: 14px;
  margin-right: 8px;
`;
