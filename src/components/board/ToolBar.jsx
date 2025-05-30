import React, { useRef } from "react";
import styled from "styled-components";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Undo2,
  Redo2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
} from "lucide-react";

export default function Toolbar({ editor, onImageInsert }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageInsert(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    editor.chain().focus().setColor(color).run();
  };

  return (
    <>
      <ToolbarWrapper>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
          <AlignRight size={16} />
        </ToolbarButton>
        <Divider />

        <ToolbarButton onClick={handleImageUpload}>
          <ImageIcon size={16} />
        </ToolbarButton>
        <Divider />

        <ColorInput type="color" onChange={handleColorChange} title="글자 색상 선택" />
        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </ToolbarButton>
      </ToolbarWrapper>

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileChange}
      />
    </>
  );
}

// === 스타일 ===

const ToolbarWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  position: sticky;
  top: 0;
  background-color: white;
  padding: 8px 0;
  z-index: 10;
  border-bottom: 1px solid #e0e0e0;
`;

const ToolbarButton = styled.button`
  color: ${({ active }) => (active ? "#235BA9" : "#000")};
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #ccc;
  margin: 0 4px;
`;

const ColorInput = styled.input`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;