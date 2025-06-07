import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import BoardNav from "../../layout/board/BoardNav";
import Footer from "../../layout/Footer";
import ToolBar from "../../components/board/ToolBar";
import { usePost, useUpdatePost } from "../../query/usePost";
import { extractImageUrls } from "../../api/PostApi";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

export default function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const editorRef = useRef(null);

  // 게시물 데이터 가져오기
  const { data: postData, isLoading, isError, error } = usePost(id);
  
  // 게시물 수정 훅
  const updatePostMutation = useUpdatePost();

  // PostWritePage와 동일한 에디터 설정
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
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
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
    if (postData?.result && editor && !isDataLoaded) {
      const post = postData.result;
      
      // 작성자 확인
      if (String(post.userId) !== String(userId)) {
        alert('수정 권한이 없습니다.');
        navigate(`/board/detail/${id}`);
        return;
      }

      setTitle(post.title || "");
      editor.commands.setContent(post.content || "");
      setIsDataLoaded(true);
      
      console.log('게시물 데이터 로드 완료:', post);
    }
  }, [postData, editor, navigate, id, isDataLoaded]);

  // PostWritePage와 동일한 이미지 삽입 함수
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!editor?.getText().trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const htmlContent = editor.getHTML();
      const imageUrls = extractImageUrls(htmlContent);

      const postUpdateData = {
        title: title.trim(),
        content: htmlContent,
        imageUrls: imageUrls
      };

      console.log('게시물 수정 데이터:', postUpdateData);
      
      await updatePostMutation.mutateAsync({
        postId: id,
        postData: postUpdateData
      });
      
      // 상세 페이지로 이동
      navigate(`/board/detail/${id}`);
      
    } catch (error) {
      console.error("게시물 수정 실패:", error);
      alert("게시물 수정에 실패했습니다: " + error.message);
    }
  };

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

  if (!postData?.result) {
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
        <Header>
          <Title>게시물 수정</Title>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <TitleInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
          />
          
          <EditorWrapper ref={editorRef}>
            {editor && <ToolBar editor={editor} onImageInsert={insertImage} />}
            <EditorContent editor={editor} />
          </EditorWrapper>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate(`/board/detail/${id}`)}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={updatePostMutation.isPending}>
              {updatePostMutation.isPending ? "수정 중..." : "수정 완료"}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </Wrapper>
      <Footer />
    </>
  );
}

// Styled Components
const Wrapper = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 32px 16px;
  background: #fff;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #235ba9;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #1a4b8c;
    box-shadow: 0 0 0 2px rgba(35, 91, 169, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const EditorWrapper = styled.div`
  border: 1px solid #235ba9;
  border-radius: 8px;
  padding: 12px;
  min-height: 400px;

  .ProseMirror {
    min-height: 300px;
    outline: none;
    font-size: 16px;
    line-height: 1.6;
  }

  .ProseMirror p {
    margin: 8px 0;
  }

  .ProseMirror img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 16px auto;
    border-radius: 8px;
  }

  .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
    font-weight: bold;
    margin: 16px 0 8px 0;
  }

  .ProseMirror h1 { font-size: 1.8em; }
  .ProseMirror h2 { font-size: 1.5em; }
  .ProseMirror h3 { font-size: 1.3em; }

  .ProseMirror ul, .ProseMirror ol {
    padding-left: 20px;
    margin: 8px 0;
  }

  .ProseMirror li {
    margin: 4px 0;
  }

  .ProseMirror blockquote {
    border-left: 4px solid #235ba9;
    padding-left: 16px;
    margin: 16px 0;
    font-style: italic;
    color: #666;
  }

  .ProseMirror code {
    background: #f5f5f5;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }

  .ProseMirror pre {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
  }

  .ProseMirror pre code {
    background: none;
    padding: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #666;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const SubmitButton = styled(Button)`
  background: #235BA9;
  color: white;

  &:hover:not(:disabled) {
    background: #1a4b8c;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #e74c3c;
`;
