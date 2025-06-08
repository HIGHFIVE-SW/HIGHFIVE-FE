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
import ActivitySearchInput from "../../components/search/ActivitySearchInput";
import ImageAlertModal from "../../components/board/ImageAlertModal";
import PointAlertModal from "../../components/board/PointAlertModal";
import NotPointAlertModal from "../../components/board/NotPointAlertModal";
import AwardNotVerifiedModal from "../../components/board/NotAwardModal"; // 실제 export 이름은 NotPointAlertModal
import AwardAlertModal from "../../components/board/NotAllAlertModal"; // 실제 export 이름은 AwardAlertModal
import { 
  useCreatePost, 
  useCreateActivityReview, 
  useCreateNewActivityReview 
} from "../../query/usePost";
import { 
  extractImageUrls, 
  CATEGORY_MAP, 
  ACTIVITY_TYPE_MAP, 
  ACTIVITY_PERIOD_MAP,
  uploadSingleImage
} from "../../api/PostApi";
import { useNavigate } from "react-router-dom";

export default function PostWritePage() {
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState("");
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
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryAuto, setIsCategoryAuto] = useState(false);
  const [isTypeAuto, setIsTypeAuto] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [createdReviewId, setCreatedReviewId] = useState(null); // 생성된 리뷰 ID 저장
  
  // 중복 제출 방지를 위한 ref
  const submitLockRef = useRef(false);

  const isReviewBoard = selectedBoard === "후기 게시판";

  const createPostMutation = useCreatePost();
  const createActivityReviewMutation = useCreateActivityReview();
  const createNewActivityReviewMutation = useCreateNewActivityReview();

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
    console.log('서버 응답:', result);
    
    // 생성된 리뷰 ID 저장 (수정 페이지 이동을 위해)
    if (result?.id) {
      setCreatedReviewId(result.id);
    }
    
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleCheckbox = (current, setCurrent, value) => {
    setCurrent(current === value ? "" : value);
  };

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

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    
    if (activity) {
      setCategory(activity.keyword);
      setType(activity.activityType);
      setIsCategoryAuto(true);
      setIsTypeAuto(true);
    } else {
      setSelectedActivity(null);
      setIsCategoryAuto(false);
      setIsTypeAuto(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedBoard) newErrors.selectedBoard = "게시판을 선택해주세요.";
    
    if (isReviewBoard) {
      if (!activityName.trim()) newErrors.activityName = "대외활동 이름을 입력해주세요.";
      if (!category) newErrors.category = "분야 카테고리를 선택해주세요.";
      if (!type) newErrors.type = "유형 카테고리를 선택해주세요.";
      if (!activityPeriod) newErrors.activityPeriod = "활동 기간을 선택해주세요.";
      
      // 선택된 활동이 없는 경우에만 활동 종료일 필수
      if (!selectedActivity && !activityEndDate) {
        newErrors.activityEndDate = "활동 종료일을 선택해주세요.";
      }
      
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
      
      // 활동 종료일 형식 검증
      if (!selectedActivity && activityEndDate) {
        const datePattern = /^\d{4}\.\d{1,2}$|^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(activityEndDate)) {
          newErrors.activityEndDate = "올바른 날짜 형식이 아닙니다. (예: 2025.06)";
        }
      }
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
    // 1차 방어: submitLock ref로 중복 실행 방지
    if (submitLockRef.current) {
      console.log('이미 제출 중입니다. (submitLock)');
      return;
    }

    // 2차 방어: isSubmitting 상태로 중복 실행 방지
    if (isSubmitting) {
      console.log('이미 제출 중입니다. (isSubmitting)');
      return;
    }

    console.log('제출 시작 - isSubmitting:', isSubmitting);

    // 즉시 락 설정
    submitLockRef.current = true;

    if (isReviewBoard) {
      const hasEditorImage = editor?.getHTML().includes('<img');
      if (!hasEditorImage) {
        submitLockRef.current = false; // 락 해제
        setShowImageAlert(true);
        return;
      }
    }

    if (!validateForm()) {
      submitLockRef.current = false; // 락 해제
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 제출 상태를 즉시 true로 설정하여 중복 방지
    setIsSubmitting(true);
    console.log('제출 상태 설정 완료 - isSubmitting:', true);

    try {
      const htmlContent = editor.getHTML();
      const imageUrls = extractImageUrls(htmlContent);

      if (isReviewBoard) {
        if (selectedActivity) {
          // 기존 활동 리뷰 생성
          const activityReviewData = {
            title: title.trim(),
            activityPeriod: ACTIVITY_PERIOD_MAP[activityPeriod],
            content: htmlContent,
            awardImageUrl: awardImageUrl || null,
            imageUrls: imageUrls || []
          };

          console.log('기존 활동 리뷰 데이터:', activityReviewData);
          console.log('선택된 활동 ID:', selectedActivity.id);
          
          // 3차 방어: mutation이 이미 진행 중이면 중단
          if (createActivityReviewMutation.isPending) {
            console.log('기존 활동 리뷰 mutation이 이미 진행 중입니다.');
            submitLockRef.current = false;
            setIsSubmitting(false);
            return;
          }
          
          console.log('기존 활동 리뷰 API 호출 시작');
          const result = await createActivityReviewMutation.mutateAsync({
            activityId: selectedActivity.id,
            reviewData: activityReviewData
          });
          
          console.log('기존 활동 리뷰 생성 완료:', result);
          
          // 성공 즉시 락 해제
          submitLockRef.current = false;
          
          // 서버 응답에 따른 모달 표시
          handleReviewResponse(result);
        } else {
          // 새 활동 리뷰 생성
          const mappedKeyword = CATEGORY_MAP[category];
          const mappedActivityType = ACTIVITY_TYPE_MAP[type];
          const mappedActivityPeriod = ACTIVITY_PERIOD_MAP[activityPeriod];
          
          if (!mappedKeyword || !mappedActivityType || !mappedActivityPeriod) {
            throw new Error('매핑되지 않은 카테고리나 유형이 있습니다.');
          }
          
          // 개선된 날짜 형식 변환
          const formatActivityEndDate = (dateString) => {
            if (!dateString || dateString.trim() === '') {
              return null;
            }
            
            if (dateString.includes('.')) {
              const parts = dateString.split('.');
              if (parts.length === 2) {
                const year = parts[0].trim();
                const month = parts[1].trim().padStart(2, '0');
                
                if (year.length === 4 && month.length === 2 && 
                    !isNaN(year) && !isNaN(month) && 
                    parseInt(month) >= 1 && parseInt(month) <= 12) {
                  return `${year}-${month}-01`;
                }
              }
            }
            
            if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
              return dateString;
            }
            
            return null;
          };

          const newActivityReviewData = {
            title: title.trim(),
            keyword: mappedKeyword,
            activityType: mappedActivityType,
            activityPeriod: mappedActivityPeriod,
            activityEndDate: formatActivityEndDate(activityEndDate),
            activityName: activityName.trim(),
            content: htmlContent,
            awardImageUrl: awardImageUrl || null,
            imageUrls: imageUrls || []
          };

          console.log('새 활동 리뷰 데이터:', newActivityReviewData);
          
          // 3차 방어: mutation이 이미 진행 중이면 중단
          if (createNewActivityReviewMutation.isPending) {
            console.log('새 활동 리뷰 mutation이 이미 진행 중입니다.');
            submitLockRef.current = false;
            setIsSubmitting(false);
            return;
          }
          
          console.log('새 활동 리뷰 API 호출 시작');
          const result = await createNewActivityReviewMutation.mutateAsync(newActivityReviewData);
          console.log('새 활동 리뷰 생성 완료:', result);
          
          // 성공 즉시 락 해제
          submitLockRef.current = false;
          
          // 서버 응답에 따른 모달 표시
          handleReviewResponse(result);
        }
      } else {
        // 자유 게시판 처리
        const postData = {
          title: title.trim(),
          content: htmlContent,
          imageUrls: imageUrls || []
        };

        console.log('자유 게시판 데이터:', postData);
        
        const result = await createPostMutation.mutateAsync(postData);
        console.log('자유 게시판 게시물 생성 완료:', result);
        
        submitLockRef.current = false;
        alert("게시물이 등록되었습니다!");
        navigate('/board/free');
      }
        
    } catch (error) {
      console.error('게시물 작성 실패:', error);
      
      let errorMessage = '게시물 작성에 실패했습니다.';
      
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
    } finally {
      // 에러 발생 시에도 락 해제
      submitLockRef.current = false;
      // 상태 정리를 지연시켜 중복 클릭 방지
      setTimeout(() => {
        setIsSubmitting(false);
        console.log('제출 상태 해제 완료');
      }, 500);
    }
  };

  // 다시 제출하기 핸들러 - 수정 페이지로 이동
  const handleResubmit = () => {
    resetModalStates();
    
    if (createdReviewId) {
      // 생성된 리뷰의 수정 페이지로 이동
      navigate(`/board/review/edit/${createdReviewId}`, { replace: true });
    } else {
      // 리뷰 ID가 없는 경우 현재 페이지에서 다시 작성
      console.warn('생성된 리뷰 ID가 없습니다.');
    }
  };

  // 모달 확인 버튼 핸들러 (성공 시 페이지 이동)
  const handleModalConfirm = () => {
    resetModalStates();
    navigate('/board/review', { replace: true });
  };

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
            <Title>글쓰기</Title>
            {selectedBoard === "나" && (
              <PostMenuWrapper>
                <MenuButton onClick={() => setShowPostMenu((prev) => !prev)}>
                  <MenuDot />
                  <MenuDot />
                  <MenuDot />
                </MenuButton>
                {showPostMenu && (
                  <DropdownMenu>
                    <DropdownItem onClick={() => { setShowPostMenu(false); }}>수정</DropdownItem>
                    <DropdownItem onClick={() => { setShowPostMenu(false); }}>삭제</DropdownItem>
                  </DropdownMenu>
                )}
              </PostMenuWrapper>
            )}
          </TitleRow>
          <SubmitButton 
            onClick={handleSubmit}
            disabled={
              isSubmitting || 
              createActivityReviewMutation.isPending || 
              createNewActivityReviewMutation.isPending ||
              createPostMutation.isPending
            }
            type="button"
          >
            {(isSubmitting || 
              createActivityReviewMutation.isPending || 
              createNewActivityReviewMutation.isPending ||
              createPostMutation.isPending) ? '등록 중...' : '등록'}
          </SubmitButton>
        </Header>

        <CustomDropdown
          options={["후기 게시판", "자유 게시판"]}
          selected={selectedBoard}
          onSelect={setSelectedBoard}
          placeholder="게시판을 선택해주세요"
          borderColor="#235ba9"
          placeholderColor="#aaa"
          height="22px"
        />
        {errors.selectedBoard && <ErrorText>{errors.selectedBoard}</ErrorText>}
        <Divider />

        {isReviewBoard && (
          <>
            <ActivityNameSection>
              <SubTitle>
                대외활동 이름 <span style={{ color: "red" }}>*</span>
              </SubTitle>
              {errors.activityName && <ErrorText>{errors.activityName}</ErrorText>}
              <Row>
                <div style={{ flex: 1 }}>
                  <ActivitySearchInput
                    value={activityName}
                    onChange={(name) => {
                      setActivityName(name);
                      if (!name) {
                        setSelectedActivity(null);
                        setIsCategoryAuto(false);
                        setIsTypeAuto(false);
                      }
                    }}
                    onActivitySelect={handleActivitySelect}
                  />
                </div>
                <DirectInput
                  placeholder="검색 결과가 없을 경우, 직접 입력하세요"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                />
              </Row>
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
                        onChange={() => handleCheckbox(category, setCategory, cat)}
                        disabled={isCategoryAuto}
                      />
                      {cat}
                    </label>
                  ))}
                </CheckboxGroup>
                
                <SubTitle>유형 카테고리 선택 <span style={{ color: "red" }}>*</span></SubTitle>
                {errors.type && <ErrorText>{errors.type}</ErrorText>}
                <CheckboxGroup>
                  {["공모전", "봉사활동", "인턴십", "서포터즈"].map((typeItem) => (
                    <label key={typeItem}>
                      <input
                        type="checkbox"
                        checked={type === typeItem}
                        onChange={() => handleCheckbox(type, setType, typeItem)}
                        disabled={isTypeAuto}
                      />
                      {typeItem}
                    </label>
                  ))}
                </CheckboxGroup>
                
                <Row style={{ alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <SubTitle>활동 기간 선택 <span style={{ color: "red" }}>*</span></SubTitle>
                    <CustomDropdown
                      options={["하루", "일주일", "1개월", "6개월 이내", "6개월 이상"]}
                      selected={activityPeriod}
                      onSelect={setActivityPeriod}
                      placeholder="활동 기간"
                      borderColor="#235ba9"
                      placeholderColor="#aaa"
                      height="22px"
                    />
                    {errors.activityPeriod && <ErrorText>{errors.activityPeriod}</ErrorText>}
                  </div>
                  
                  <div style={{ flex: 1, marginRight: 230 }}>
                    <SubTitle>활동 종료일 선택 <span style={{ color: "red" }}>*</span></SubTitle>
                    <MonthPicker
                      selectedMonth={activityEndDate}
                      onSelect={setActivityEndDate}
                      placeholder="활동 종료일"
                      borderColor="#235ba9"
                      placeholderColor="#aaa"
                      height="22px"
                    />
                    {errors.activityEndDate && <ErrorText>{errors.activityEndDate}</ErrorText>}
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
          </>
        )}

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

const DirectInput = styled(Input)`
  flex: 1;
  margin-left: 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid #d9d9d9;
  margin: 16px 0;
  width: 100%;
`;

const PostMenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MenuDot = styled.span`
  width: 4px;
  height: 4px;
  background: #222;
  border-radius: 50%;
  display: block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  min-width: 70px;
  z-index: 10;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 10px 0;
  color: #222;
  font-size: 15px;
  cursor: pointer;
  text-align: left;
  &:hover {
    background: #f6f6f6;
  }
`;
