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
} from "lucide-react";
import { uploadMultipleImages } from "../../api/PostApi";

export default function Toolbar({ editor, onImageInsert }) {
  const fileInputRef = useRef(null);

  // 이벤트 기본 동작 방지 함수
  const handleToolbarAction = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  // 이미지 업로드
  const handleImageUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  // 파일 처리
  const onFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 현재 에디터에 있는 이미지 개수 확인
    let currentImageCount = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image') currentImageCount += 1;
    });

    // 총 5개까지만 허용
    const remainingSlots = 5 - currentImageCount;
    
    if (remainingSlots <= 0) {
      alert('이미지는 최대 5개까지만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    // 선택한 파일이 남은 슬롯보다 많으면 제한
    const filesToUpload = files.slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      alert(`이미지는 최대 5개까지만 업로드할 수 있습니다. ${filesToUpload.length}개만 업로드됩니다.`);
    }

    try {
      console.log(`${filesToUpload.length}개 이미지 업로드 중...`);
      
      // S3에 이미지 업로드
      const uploadedUrls = await uploadMultipleImages(filesToUpload);
      
      // 에디터에 이미지들 순차적으로 삽입
      uploadedUrls.forEach((url, index) => {
        setTimeout(() => {
          onImageInsert(url);
        }, index * 100);
      });

      console.log(`${filesToUpload.length}개 이미지 업로드 완료`);
      
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다: ' + error.message);
    } finally {
      e.target.value = '';
    }
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    editor.chain().focus().setColor(color).run();
  };

  // 현재 이미지 개수 표시용 함수
  const getCurrentImageCount = () => {
    let count = 0;
    editor?.state.doc.descendants((node) => {
      if (node.type.name === 'image') count += 1;
    });
    return count;
  };

  return (
    <>
      <ToolbarWrapper>
        <ToolbarButton 
          type="button"
          onClick={handleToolbarAction(() => editor.chain().focus().toggleBold().run())} 
          active={editor.isActive("bold")}
        >
          <Bold size={16} />
        </ToolbarButton>
        
        <ToolbarButton 
          type="button"
          onClick={handleToolbarAction(() => editor.chain().focus().toggleItalic().run())} 
          active={editor.isActive("italic")}
        >
          <Italic size={16} />
        </ToolbarButton>
        
        <ToolbarButton 
          type="button"
          onClick={handleToolbarAction(() => editor.chain().focus().toggleUnderline().run())} 
          active={editor.isActive("underline")}
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <Divider />

        <ToolbarButton 
          type="button"
          onClick={handleToolbarAction(() => editor.chain().focus().setTextAlign("left").run())} 
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        
        <ToolbarButton 
          type="button"
          onClick={handleToolbarAction(() => editor.chain().focus().setTextAlign("center").run())} 
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        
        <ToolbarButton 
          type="button"
          onClick={handleToolbarAction(() => editor.chain().focus().setTextAlign("right").run())} 
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight size={16} />
        </ToolbarButton>
        <Divider />

        <ImageUploadWrapper>
          <ToolbarButton 
            type="button"
            onClick={handleImageUpload} 
            title={`이미지 업로드 (${getCurrentImageCount()}/5)`}
          >
            <ImageIcon size={16} />
          </ToolbarButton>
          <ImageCounter>{getCurrentImageCount()}/5</ImageCounter>
        </ImageUploadWrapper>
        <Divider />

        <ColorInput type="color" onChange={handleColorChange} title="글자 색상 선택" />
        <Divider />

        <ToolbarButton 
          type="button"
          onClick={handleToolbarAction(() => editor.chain().focus().undo().run())}
        >
          <Undo2 size={16} />
        </ToolbarButton>
        
        <ToolbarButton 
          type="button"
          onClick={handleToolbarAction(() => editor.chain().focus().redo().run())}
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </ToolbarWrapper>

      {/* 이미지 업로드 (단일/여러 개 모두 지원) */}
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileChange}
      />
    </>
  );
}


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
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ImageUploadWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ImageCounter = styled.span`
  font-size: 10px;
  color: #666;
  margin-left: 2px;
  font-weight: 500;
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
