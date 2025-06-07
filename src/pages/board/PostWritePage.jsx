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
import { useCreatePost, useCreateReview } from "../../query/usePost";
import { 
  extractImageUrls, 
  CATEGORY_MAP, 
  ACTIVITY_TYPE_MAP, 
  ACTIVITY_PERIOD_MAP,
  uploadSingleImage // 추가
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
  const [awardImageUrl, setAwardImageUrl] = useState(''); // 추가
  const [isUploadingAward, setIsUploadingAward] = useState(false); // 추가
  const [errors, setErrors] = useState({});
  const [showImageAlert, setShowImageAlert] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryAuto, setIsCategoryAuto] = useState(false);
  const [isTypeAuto, setIsTypeAuto] = useState(false);

  const isReviewBoard = selectedBoard === "후기 게시판";

  const createPostMutation = useCreatePost();
  const createReviewMutation = useCreateReview();

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

  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }

  try {
    setIsUploadingAward(true);
    
    // 미리보기 설정
    setAwardPreview(URL.createObjectURL(file));
    
    // S3에 업로드
    const uploadedUrl = await uploadSingleImage(file);
    setAwardImageUrl(uploadedUrl);
    
    console.log('수상 기록 이미지 업로드 완료:', uploadedUrl);
    
  } catch (error) {
    console.error('수상 기록 이미지 업로드 실패:', error);
    alert('이미지 업로드에 실패했습니다: ' + error.message);
    
    // 실패 시 미리보기 제거
    setAwardPreview(null);
    setAwardImageUrl('');
  } finally {
    setIsUploadingAward(false);
  }
};

  // 수상 기록 이미지 제거 함수 추가
  const handleRemoveAwardImage = () => {
    setAwardPreview(null);
    setAwardImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      if (!activityEndDate) newErrors.activityEndDate = "활동 종료일을 선택해주세요.";
    }
    if (!title.trim()) newErrors.title = "제목을 입력해주세요.";
    if (!editor?.getText().trim()) newErrors.content = "본문을 입력해주세요.";

    setErrors(newErrors);

    const isOnlyContentError =
      Object.keys(newErrors).length === 1 && newErrors.content;

    if (isOnlyContentError && editorRef.current) {
      setTimeout(() => {
        editorRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isReviewBoard) {
      const hasEditorImage = editor?.getHTML().includes('<img');
      if (!hasEditorImage) {
        setShowImageAlert(true);
        return;
      }
    }

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const htmlContent = editor.getHTML();
      const imageUrls = extractImageUrls(htmlContent);

      if (isReviewBoard) {
        // 후기 게시판 데이터 구성 (수상 기록 이미지 URL 추가)
        const reviewData = {
          title: title.trim(),
          keyword: CATEGORY_MAP[category],
          activityType: ACTIVITY_TYPE_MAP[type],
          activityPeriod: ACTIVITY_PERIOD_MAP[activityPeriod],
          activityEndDate: activityEndDate,
          activityName: activityName.trim(),
          content: htmlContent,
          imageUrls: imageUrls,
          awardImageUrl: awardImageUrl || null // 수상 기록 이미지 URL 추가
        };

        console.log('후기 게시판 데이터:', reviewData);
        await createReviewMutation.mutateAsync(reviewData);
        
      } else {
        // 자유 게시판 데이터 구성
        const postData = {
          title: title.trim(),
          content: htmlContent,
          imageUrls: imageUrls
        };

        console.log('자유 게시판 데이터:', postData);
        await createPostMutation.mutateAsync(postData);
      }

      alert("등록 완료!");
      navigate('/board/free');
      
    } catch (error) {
      console.error('게시물 작성 실패:', error);
      alert('게시물 작성에 실패했습니다: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BoardNav />
      {showImageAlert && <ImageAlertModal onClose={() => setShowImageAlert(false)} />}

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
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '등록'}
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
                        setIsCategoryAuto(false);
                        setIsTypeAuto(false);
                      }
                    }}
                    onActivitySelect={(activity) => {
                      if (activity) {
                        setCategory(activity.keyword);
                        setType(activity.activityType);
                        setIsCategoryAuto(true);
                        setIsTypeAuto(true);
                      } else {
                        setIsCategoryAuto(false);
                        setIsTypeAuto(false);
                      }
                    }}
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
                  {"공모전 봉사 인턴십 서포터즈".split(" ").map((typeItem) => (
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

// 기존 styled-components + 추가 스타일
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

// 새로 추가된 스타일 컴포넌트들
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
