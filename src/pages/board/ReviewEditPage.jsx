import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import ToolBar from "../../components/board/ToolBar";
import BoardNav from "../../layout/board/BoardNav";
import CustomDropdown from "../../components/common/CustomDropdown";
import MonthPicker from "../../components/common/CustomMonthPicker";
import ImageAlertModal from "../../components/board/ImageAlertModal";
import PointAlertModal from "../../components/board/PointAlertModal";
import NotPointAlertModal from "../../components/board/NotPointAlertModal";
import AwardNotVerifiedModal from "../../components/board/NotAwardModal";
import AwardAlertModal from "../../components/board/NotAllAlertModal";
import { useReview } from "../../query/usePost";
import { 
  extractImageUrls, 
  CATEGORY_MAP, 
  ACTIVITY_TYPE_MAP, 
  ACTIVITY_PERIOD_MAP,
  uploadSingleImage,
  updateReview
} from "../../api/PostApi";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function ReviewEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [activityName, setActivityName] = useState("");
  const [activityPeriod, setActivityPeriod] = useState("");
  const [activityEndDate, setActivityEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [awardPreview, setAwardPreview] = useState(null);
  const [awardImageUrl, setAwardImageUrl] = useState('');
  const [isUploadingAward, setIsUploadingAward] = useState(false);
  const [errors, setErrors] = useState({});
  const [showImageAlert, setShowImageAlert] = useState(false);
  const [showPointAlert, setShowPointAlert] = useState(false);
  const [showNotPointAlert, setShowNotPointAlert] = useState(false);
  const [showNotAwardAlert, setShowNotAwardAlert] = useState(false);
  const [showNotAllAlert, setShowNotAllAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // 중복 제출 방지를 위한 ref
  const submitLockRef = useRef(false);

  // 기존 데이터 불러오기
  const { 
    data: reviewData, 
    isLoading: isReviewLoading, 
    isError: isReviewError 
  } = useReview(id);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: "",
  });

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  // 모달 상태 초기화 함수
  const resetModalStates = () => {
    setShowImageAlert(false);
    setShowPointAlert(false);
    setShowNotPointAlert(false);
    setShowNotAwardAlert(false);
    setShowNotAllAlert(false);
  };

  // 서버 응답에 따른 모달 표시 함수
  const handleReviewResponse = (result) => {
    console.log('후기 수정 서버 응답:', result);
    
    // 응답에서 OCR 결과와 수상기록 검증 상태 확인 (실제 서버 응답 필드명 사용)
    const ocrResult = result?.ocrResult; // 이미지 검증 결과
    const awardResult = result?.awardOcrResult; // 수상기록 검증 결과
    
    console.log('검증 결과:', { ocrResult, awardResult });
    console.log('전체 서버 응답:', result);
    
    // 검증 로직
    if (awardResult === false && ocrResult === false) {
      // 수상기록 false & ocrResult false → 모든 자료 검증 실패
      setShowNotAllAlert(true);
    } else if (awardResult === false) {
      // 수상기록이 false → 수상기록 검증 실패
      setShowNotAwardAlert(true);
    } else if (ocrResult === false) {
      // ocrResult가 false → 이미지 검증 실패
      setShowNotPointAlert(true);
    } else if ((awardResult === null && ocrResult === true) || (awardResult === true && ocrResult === true)) {
      // 수상기록 null & ocrResult true → 검증 성공
      // 수상기록 true & ocrResult true → 검증 성공
      setShowPointAlert(true);
    } else {
      // 기타 경우 기본 성공 처리
      setShowPointAlert(true);
    }
  };

  // 수정 API 호출을 위한 mutation
  const updateReviewMutation = useMutation({
    mutationFn: ({ reviewId, reviewData }) => updateReview(reviewId, reviewData),
    onSuccess: (result) => {
      queryClient.invalidateQueries(['review', id]);
      queryClient.invalidateQueries(['reviews']);
      
      // 서버 응답에 따른 모달 표시
      handleReviewResponse(result);
    },
    onError: (error) => {
      console.error('리뷰 수정 실패:', error);
      
      let errorMessage = '게시물 수정에 실패했습니다.';
      
      if (error.response?.data) {
        const serverError = error.response.data;
        if (serverError.detail) {
          errorMessage += `\n상세: ${serverError.detail}`;
        }
        if (serverError.title) {
          errorMessage += `\n오류: ${serverError.title}`;
        }
      } else if (error.message) {
        errorMessage += `\n${error.message}`;
      }
      
      alert(errorMessage);
    }
  });

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    // 게시물 데이터가 로드되면 에디터에 설정
    if (reviewData && editor && !isDataLoaded) {
      console.log('기존 리뷰 데이터:', reviewData);
      
      // 작성자 확인 - PostEditPage와 동일한 방식
      if (String(reviewData.userId) !== String(userId)) {
        alert('수정 권한이 없습니다.');
        navigate(`/board/review/${id}`);
        return;
      }
      
      setTitle(reviewData.title || "");
      setActivityName(reviewData.activityName || "");
      setCategory(reviewData.keyword || "");
      setType(reviewData.activityType || "");
      setActivityPeriod(reviewData.activityPeriod || "");
      
      // 활동 종료일 설정
      if (reviewData.activityEndDate) {
        // 서버에서 받은 날짜를 YYYY.MM 형태로 변환
        const date = new Date(reviewData.activityEndDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        setActivityEndDate(`${year}.${month}`);
      }
      
      // 에디터 내용 설정
      if (reviewData.content) {
        editor.commands.setContent(reviewData.content);
      }
      
      // 수상 기록 이미지 설정
      if (reviewData.awardImageUrl) {
        setAwardImageUrl(reviewData.awardImageUrl);
        setAwardPreview(reviewData.awardImageUrl);
      }
      
      setIsDataLoaded(true);
      console.log('리뷰 데이터 로드 완료:', reviewData);
    }
  }, [reviewData, editor, navigate, id, isDataLoaded]);

  // 로딩 상태 체크
  useEffect(() => {
    if (!isReviewLoading && !reviewData) {
      alert('게시물을 찾을 수 없습니다.');
      navigate('/board/review');
    }
  }, [isReviewLoading, reviewData, navigate]);

  const insertImage = (src) => {
    if (!editor) return;

    let imgCount = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image') imgCount += 1;
    });

    if (imgCount >= 5) {
      alert('이미지는 최대 5개까지만 업로드할 수 있습니다.');
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({ src })
      .createParagraphNear()
      .focus()
      .run();
  };

  const handleAwardImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setIsUploadingAward(true);
      setAwardPreview(URL.createObjectURL(file));
      const uploadedUrl = await uploadSingleImage(file);
      setAwardImageUrl(uploadedUrl);
      console.log('수상 기록 이미지 업로드 완료:', uploadedUrl);
    } catch (error) {
      console.error('수상 기록 이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다: ' + error.message);
      setAwardPreview(null);
      setAwardImageUrl('');
    } finally {
      setIsUploadingAward(false);
    }
  };

  const handleRemoveAwardImage = () => {
    setAwardPreview(null);
    setAwardImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!activityName.trim()) newErrors.activityName = "대외활동 이름을 입력해주세요.";
    if (!category) newErrors.category = "분야 카테고리를 선택해주세요.";
    if (!type) newErrors.type = "유형 카테고리를 선택해주세요.";
    if (!activityPeriod) newErrors.activityPeriod = "활동 기간을 선택해주세요.";
    
    // 매핑 검증 추가
    if (category && !CATEGORY_MAP[category]) {
      newErrors.category = "유효하지 않은 카테고리입니다.";
    }
    if (type && !ACTIVITY_TYPE_MAP[type]) {
      newErrors.type = "유효하지 않은 활동 유형입니다.";
    }
    if (activityPeriod && !ACTIVITY_PERIOD_MAP[activityPeriod]) {
      newErrors.activityPeriod = "유효하지 않은 활동 기간입니다.";
    }
    
    if (!title.trim()) newErrors.title = "제목을 입력해주세요.";
    if (!editor?.getText().trim()) newErrors.content = "본문을 입력해주세요.";

    setErrors(newErrors);
    
    // 디버깅용 로그
    if (Object.keys(newErrors).length > 0) {
      console.log('유효성 검사 실패:', newErrors);
    }

    const isOnlyContentError = Object.keys(newErrors).length === 1 && newErrors.content;

    if (isOnlyContentError && editorRef.current) {
      setTimeout(() => {
        editorRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // 중복 제출 방지
    if (submitLockRef.current || isSubmitting) {
      console.log('이미 제출 중입니다.');
      return;
    }

    // 이미지 검증
    const hasEditorImage = editor?.getHTML().includes('<img');
    if (!hasEditorImage) {
      setShowImageAlert(true);
      return;
    }

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      const htmlContent = editor.getHTML();
      const imageUrls = extractImageUrls(htmlContent);

      const reviewData = {
        title: title.trim(),
        content: htmlContent,
        awardImageUrl: awardImageUrl || null,
        imageUrls: imageUrls || []
      };

      console.log('리뷰 수정 데이터:', reviewData);
      
      await updateReviewMutation.mutateAsync({
        reviewId: id,
        reviewData: reviewData
      });
      
    } catch (error) {
      console.error('게시물 수정 실패:', error);
    } finally {
      submitLockRef.current = false;
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  // 다시 제출하기 핸들러 - 현재 페이지에서 다시 수정
  const handleResubmit = () => {
    resetModalStates();
    // 수정 페이지이므로 모달만 닫고 현재 페이지에서 계속 수정 가능
  };

  // 모달 확인 버튼 핸들러 (성공 시 상세 페이지로 이동)
  const handleModalConfirm = () => {
    resetModalStates();
    navigate(`/board/review/${id}`, { replace: true });
  };

  // 로딩 중일 때
  if (isReviewLoading) {
    return (
      <>
        <BoardNav />
        <Container>
          <LoadingMessage>게시물을 불러오는 중...</LoadingMessage>
        </Container>
      </>
    );
  }

  // 에러 발생 시
  if (isReviewError) {
    return (
      <>
        <BoardNav />
        <Container>
          <ErrorMessage>게시물을 불러오는데 실패했습니다.</ErrorMessage>
        </Container>
      </>
    );
  }

  // 게시물이 없을 때
  if (!reviewData) {
    return (
      <>
        <BoardNav />
        <Container>
          <ErrorMessage>게시물을 찾을 수 없습니다.</ErrorMessage>
        </Container>
      </>
    );
  }

  return (
    <>
      <BoardNav />
      {showImageAlert && <ImageAlertModal onClose={() => setShowImageAlert(false)} />}
      {showPointAlert && <PointAlertModal onClose={handleModalConfirm} />}
      {showNotPointAlert && (
        <NotPointAlertModal 
          onClose={handleModalConfirm} 
          onResubmit={handleResubmit} 
        />
      )}
      {showNotAwardAlert && (
        <AwardNotVerifiedModal 
          onClose={handleModalConfirm} 
          onResubmit={handleResubmit} 
        />
      )}
      {showNotAllAlert && (
        <AwardAlertModal 
          onClose={handleModalConfirm} 
          onResubmit={handleResubmit} 
        />
      )}

      <Container>
        <Header>
          <TitleRow>
            <Title>후기 글 수정</Title>
          </TitleRow>
          <SubmitButton 
            onClick={handleSubmit}
            disabled={isSubmitting || updateReviewMutation.isPending}
            type="button"
          >
            {(isSubmitting || updateReviewMutation.isPending) ? '수정 중...' : '수정 완료'}
          </SubmitButton>
        </Header>
        <Divider />

        <ActivityNameSection>
          <SubTitle>
            대외활동 이름 <span style={{ color: "red" }}>*</span>
          </SubTitle>
          {errors.activityName && <ErrorText>{errors.activityName}</ErrorText>}
          <ActivityInput
            placeholder="대외활동 이름"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            readOnly
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
          <ReadOnlyNotice>* 활동 이름은 수정할 수 없습니다.</ReadOnlyNotice>
        </ActivityNameSection>
        
        <Row>
          <div style={{ flex: 2, marginRight: 24 }}>
            <SubTitle>분야 카테고리 선택 <span style={{ color: "red" }}>*</span></SubTitle>
            {errors.category && <ErrorText>{errors.category}</ErrorText>}
            <CheckboxGroup>
              {["환경", "사람과 사회", "경제", "기술"].map((cat) => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    checked={category === cat}
                    onChange={() => {}}
                    disabled
                  />
                  {cat}
                </label>
              ))}
            </CheckboxGroup>
            <ReadOnlyNotice>* 분야 카테고리는 수정할 수 없습니다.</ReadOnlyNotice>
            
            <SubTitle>유형 카테고리 선택 <span style={{ color: "red" }}>*</span></SubTitle>
            {errors.type && <ErrorText>{errors.type}</ErrorText>}
            <CheckboxGroup>
              {["공모전", "봉사활동", "인턴십", "서포터즈"].map((typeItem) => (
                <label key={typeItem}>
                  <input
                    type="checkbox"
                    checked={type === typeItem}
                    onChange={() => {}}
                    disabled
                  />
                  {typeItem}
                </label>
              ))}
            </CheckboxGroup>
            <ReadOnlyNotice>* 유형 카테고리는 수정할 수 없습니다.</ReadOnlyNotice>
            
            <Row style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <SubTitle>활동 기간 선택 <span style={{ color: "red" }}>*</span></SubTitle>
                <CustomDropdown
                  options={["하루", "일주일", "1개월", "6개월 이내", "6개월 이상"]}
                  selected={activityPeriod}
                  onSelect={() => {}}
                  placeholder="활동 기간"
                  borderColor="#ccc"
                  placeholderColor="#aaa"
                  height="22px"
                  disabled
                />
                {errors.activityPeriod && <ErrorText>{errors.activityPeriod}</ErrorText>}
                <ReadOnlyNotice>* 활동 기간은 수정할 수 없습니다.</ReadOnlyNotice>
              </div>
              
              <div style={{ flex: 1, marginRight: 230 }}>
                <SubTitle>활동 종료일 선택</SubTitle>
                <MonthPicker
                  selectedMonth={activityEndDate}
                  onSelect={() => {}}
                  placeholder="활동 종료일"
                  borderColor="#ccc"
                  placeholderColor="#aaa"
                  height="22px"
                  disabled
                />
                <ReadOnlyNotice>* 활동 종료일은 수정할 수 없습니다.</ReadOnlyNotice>
              </div>
            </Row>
          </div>
          
          <div style={{ flex: 1 }}>
            <AwardSection>
              <SubTitle>수상 기록</SubTitle>
              <AwardUploadBox onClick={() => !isUploadingAward && fileInputRef.current.click()}>
                {isUploadingAward ? (
                  <UploadingIndicator>
                    <div style={{ fontSize: '14px', color: '#235ba9' }}>업로드 중...</div>
                  </UploadingIndicator>
                ) : awardPreview ? (
                  <ImagePreviewContainer>
                    <img 
                      src={awardPreview} 
                      alt="수상 기록 미리보기" 
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "contain" 
                      }} 
                    />
                    <RemoveButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAwardImage();
                      }}
                    >
                      ×
                    </RemoveButton>
                  </ImagePreviewContainer>
                ) : (
                  <UploadPlaceholder>
                    <span style={{ fontSize: "48px", color: "#235ba9" }}>+</span>
                    <span style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                      수상 기록 이미지
                    </span>
                  </UploadPlaceholder>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAwardImageChange}
                  disabled={isUploadingAward}
                />
              </AwardUploadBox>
            </AwardSection>
          </div>
        </Row>
        <Divider />

        <Input
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <ErrorText>{errors.title}</ErrorText>}

        <EditorWrapper ref={editorRef}>
          {editor && <ToolBar editor={editor} onImageInsert={insertImage} />}
          <EditorContent editor={editor} />
        </EditorWrapper>
        {errors.content && <ErrorText>{errors.content}</ErrorText>}
      </Container>
    </>
  );
}

// Styled Components
const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 35px;
`;

const SubmitButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#235ba9'};
  color: white;
  padding: 8px 22px;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #1e4a8c;
  }
`;

const Input = styled.input`
  padding: 12px;
  font-size: 14px;
  border: 1px solid #235ba9;
  border-radius: 6px;
  width: 97%;
  margin-bottom: 8px;
  height: 22px;

  &::placeholder {
    color: #aaa;
    font-size: 14px;
  }
`;

const ActivityInput = styled(Input)`
  &:read-only {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #666;
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 11px;
  margin: 4px 0 4px;
`;

const SubTitle = styled.div`
  font-weight: 600;
  margin: 12px 0 8px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  
  label {
    display: flex;
    align-items: center;
    gap: 6px;
    
    input[type="checkbox"]:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const ReadOnlyNotice = styled.div`
  font-size: 8.7px;
  color: #666;
  margin-bottom: 16px;
  margin-top: 5px;
  font-style: italic;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const EditorWrapper = styled.div`
  border: 1px solid #235ba9;
  border-radius: 6px;
  padding: 12px;
  min-height: 800px;
  margin-top: 16px;
  width: 97%;

  .ProseMirror {
    min-height: 200px;
    font-size: 16px;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
   }
`;

const ActivityNameSection = styled.div`
  grid-column: 1 / 2;
`;

const AwardSection = styled.div`
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AwardUploadBox = styled.div`
  width: 90%;
  height: 190px;
  border: 1px solid #235ba9;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #fff;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
`;

const ImagePreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const UploadingIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid #d9d9d9;
  margin: 16px 0;
  width: 100%;
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