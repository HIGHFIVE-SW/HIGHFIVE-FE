import React, { useState, useRef } from "react";
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

export default function PostWritePage() {
  const [selectedBoard, setSelectedBoard] = useState("");
  const [title, setTitle] = useState("");
  const [activityName, setActivityName] = useState("");
  const [activityPeriod, setActivityPeriod] = useState("");
  const [activityEndDate, setActivityEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [awardImage, setAwardImage] = useState(null);
  const [awardPreview, setAwardPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showImageAlert, setShowImageAlert] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);

  const isReviewBoard = selectedBoard === "후기 게시판";

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

  const handleCheckbox = (current, setCurrent, value) => {
    setCurrent(current === value ? "" : value);
  };

  const insertImage = (src) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const handleAwardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAwardImage(file);
      setAwardPreview(URL.createObjectURL(file));
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

  const handleSubmit = () => {
    if (isReviewBoard) {
      const hasEditorImage = editor?.getHTML().includes('<img');
      if (!hasEditorImage) {
        setShowImageAlert(true);
        return;
      }
    }

    if (validateForm()) {
      alert("등록 완료!");
      // 실제 API 호출 로직 삽입
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <BoardNav />
      {showImageAlert && <ImageAlertModal onClose={() => setShowImageAlert(false)} />}

      <Container>
        <Header>
          <TitleRow>
            <Title>{title}</Title>
            {selectedBoard === "나" && (
              <PostMenuWrapper>
                <MenuButton onClick={() => setShowPostMenu((prev) => !prev)}>
                  <MenuDot />
                  <MenuDot />
                  <MenuDot />
                </MenuButton>
                {showPostMenu && (
                  <DropdownMenu>
                    <DropdownItem onClick={() => { setShowPostMenu(false); /* 수정 함수 */ }}>수정</DropdownItem>
                    <DropdownItem onClick={() => { setShowPostMenu(false); /* 삭제 함수 */ }}>삭제</DropdownItem>
                  </DropdownMenu>
                )}
              </PostMenuWrapper>
            )}
          </TitleRow>
          <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
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
                  <ActivitySearchInput value={activityName} onChange={setActivityName} />
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
                  <AwardUploadBox onClick={() => fileInputRef.current.click()}>
                    {awardPreview ? (
                      <img src={awardPreview} alt="미리보기" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontSize: "48px", color: "#235ba9" }}>+</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleAwardImageChange}
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
  background-color: #235ba9;
  color: white;
  padding: 8px 22px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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