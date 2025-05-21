// pages/PostWritePage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Toolbar from "../../components/board/ToolBar";
import BoardNav from "../../layout/board/BoardNav";
import CustomDropdown from "../../components/common/CustomDropdown";

export default function PostWritePage() {
  const [selectedBoard, setSelectedBoard] = useState("");
  const [title, setTitle] = useState("");
  const [activityName, setActivityName] = useState("");
  const [activityPeriod, setActivityPeriod] = useState("");
  const [activityEndDate, setActivityEndDate] = useState("");
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);

  const isReviewBoard = selectedBoard === "후기 게시판";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    content: "",
  });

  const handleCheckbox = (list, setList, value) => {
    setList(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const insertImage = (src) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  return (
    <>
      <BoardNav />
      <Container>
        <Header>
          <Title>글쓰기</Title>
          <SubmitButton>등록</SubmitButton>
        </Header>

        <CustomDropdown
          options={["자유 게시판", "후기 게시판"]}
          selected={selectedBoard}
          onSelect={setSelectedBoard}
          placeholder="게시판을 선택해주세요"
        />

        {isReviewBoard && (
          <ReviewSection>
            <SubTitle>분야 카테고리 선택 *</SubTitle>
            <CheckboxGroup>
              {["환경", "사람과 사회", "경제", "기술"].map(cat => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    checked={category.includes(cat)}
                    onChange={() => handleCheckbox(category, setCategory, cat)}
                  />
                  {cat}
                </label>
              ))}
            </CheckboxGroup>

            <SubTitle>유형 카테고리 선택 *</SubTitle>
            <CheckboxGroup>
              {["공모전", "봉사", "인턴십", "서포터즈"].map(typeItem => (
                <label key={typeItem}>
                  <input
                    type="checkbox"
                    checked={type.includes(typeItem)}
                    onChange={() => handleCheckbox(type, setType, typeItem)}
                  />
                  {typeItem}
                </label>
              ))}
            </CheckboxGroup>

            <SubTitle>활동 기간 선택 *</SubTitle>
            <Row>
              <Input
                placeholder="활동 기간"
                value={activityPeriod}
                onChange={e => setActivityPeriod(e.target.value)}
              />
              <Input
                placeholder="활동 종료일"
                value={activityEndDate}
                onChange={e => setActivityEndDate(e.target.value)}
              />
            </Row>

            <SubTitle>대외활동 이름 *</SubTitle>
            <Input
              placeholder="대외활동 이름을 입력해주세요."
              value={activityName}
              onChange={e => setActivityName(e.target.value)}
            />
          </ReviewSection>
        )}

        <Input
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <EditorWrapper>
          {editor && <Toolbar editor={editor} onImageInsert={insertImage} />}
          <EditorContent editor={editor} />
        </EditorWrapper>
      </Container>
    </>
  );
}

// ================== styled-components ==================

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

const Title = styled.h2`
  font-weight: bold;
  font-size: 35px;
`;

const SubmitButton = styled.button`
  background-color: #235ba9;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const Label = styled.div`
  font-weight: bold;
  margin: 16px 0 8px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #235ba9;
  border-radius: 6px;
  width: 100%;
  margin-bottom: 16px;
  margin-top: 8px;
`;

const ReviewSection = styled.div`
  margin-bottom: 24px;
`;

const SubTitle = styled.div`
  font-weight: bold;
  margin: 12px 0 8px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
`;

const EditorWrapper = styled.div`
  border: 1px solid #235ba9;
  border-radius: 6px;
  padding: 12px;
  min-height: 800px;
  margin-top: 16px;
  width: 100%;

  .ProseMirror {
    min-height: 200px;
    font-size: 16px;
    outline: none;
  }
`;
