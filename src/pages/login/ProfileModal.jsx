import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import avatar from '../../assets/images/profile/DefaultProfile.png';
import cameraIcon from '../../assets/images/profile/ic_ProfileCamera.png';
import InterestModal from './InterestModal';
import NotoSansKR from '../../assets/fonts/NotoSansKR-VariableFont_wght.ttf';
import { getPresignedUrl } from '../../api/userApi';

const NotoSansFont = `
@font-face {
  font-family: 'NotoSansCustom';
  src: url(${NotoSansKR}) format('truetype');
  font-weight: 100 900;
  font-style: normal;
}
`;

const GlobalFontStyle = styled.div`
  ${NotoSansFont}
`;

export default function ProfileModal({ onClose }) {
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [profileImg, setProfileImg] = useState(avatar);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();

  const handleCameraClick = () => fileInputRef.current?.click();

  const uploadImageToS3 = async (file) => {
  try {
    setIsUploading(true);
    
    const fileExtension = file.name.split('.').pop();
    // UUID 생성을 위한 간단한 함수 또는 crypto.randomUUID() 사용
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const imageName = `${uniqueId}.${fileExtension}`; // profiles/ 제거
    
    // PresignedUrl 가져오기
    const presignedUrl = await getPresignedUrl(imageName);
    console.log('Presigned URL 발급 성공:', presignedUrl);
    
    // S3에 이미지 업로드
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
      // CORS 관련 옵션 제거
      mode: 'cors'
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error response:', errorText);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    // 업로드된 이미지 URL 저장 (서버에서 반환하는 실제 경로 사용)
    const imageUrl = presignedUrl.split('?')[0]; // 쿼리 파라미터 제거
    setUploadedImageUrl(imageUrl);
    console.log('이미지 업로드 성공:', imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('상세 업로드 오류:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  } finally {
    setIsUploading(false);
  }
};

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하여야 합니다.');
          return;
        }

        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        // 미리보기 이미지 설정
        const reader = new FileReader();
        reader.onloadend = () => setProfileImg(reader.result);
        reader.readAsDataURL(file);

        // S3에 이미지 업로드
        await uploadImageToS3(file);
      } catch (error) {
        console.error('파일 처리 중 오류 발생:', error);
        alert('이미지 업로드에 실패했습니다: ' + error.message);
        // 실패 시 기본 이미지로 되돌리기
        setProfileImg(avatar);
        setUploadedImageUrl('');
      }
    }
  };

  const handleNext = () => {
    if (nickname.trim()) {
      setShowInterestModal(true);
    }
  };

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalBox onClick={e => e.stopPropagation()}>
          <GlobalFontStyle />
          <h2>프로필을 설정해주세요.</h2>
          <ProfileImageWrapper>
            <img src={profileImg} alt="프로필" />
            <CameraIcon onClick={handleCameraClick} $isUploading={isUploading} />
            {isUploading && <UploadingIndicator>업로드 중...</UploadingIndicator>}
            <HiddenFileInput
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </ProfileImageWrapper>
          <NicknameInput
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="닉네임을 입력해 주세요."
            $hasText={nickname.trim().length > 0}
            $isFocused={isFocused}
          />
          <NextButton
            $active={nickname.trim().length > 0}
            onClick={handleNext}
            disabled={nickname.trim().length === 0 || isUploading}
          >
            다음
          </NextButton>
        </ModalBox>
      </ModalOverlay>
      {showInterestModal && (
        <InterestModal
          onClose={onClose}
          nickname={nickname}
          profileUrl={uploadedImageUrl || profileImg}
        />
      )}
    </>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  font-family: 'NotoSansCustom';
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 500px;
  text-align: center;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  margin: 24px auto;
  border-radius: 50%;
  border: 0.1px solid #C4C4C4;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const CameraIcon = styled.div`
  position: absolute;
  bottom: 0px;
  right: -10px;
  width: 80px;
  height: 75.36px;
  background: white;
  border-radius: 12%;
  box-shadow: 0 2px 4px rgba(0,4,0,0.25);
  background-image: url(${cameraIcon});
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
  cursor: ${({ $isUploading }) => ($isUploading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isUploading }) => ($isUploading ? 0.5 : 1)};
`;

const UploadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 20;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const NicknameInput = styled.input`
  width: 438px;
  height: 40px;
  padding: 14px;
  margin-top: 16px;
  border: 2px solid
    ${({ $isFocused, $hasText }) =>
      $isFocused || $hasText ? '#235BA9' : '#C4C4C4'};
  border-radius: 16px;
  font-size: 16px;
  font-family: 'NotoSansCustom';
  outline: none;
  transition: border-color 0.2s ease;
`;

const NextButton = styled.button`
  margin-top: 24px;
  width: 189px;
  height: 64px;
  padding: 12px;
  font-size: 20px;
  font-family: 'NotoSansCustom';
  font-weight: 600;
  background-color: ${({ $active }) => ($active ? '#235BA9' : '#C4C4C4')};
  color: white;
  border: none;
  border-radius: 30px;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'default')};
  transition: background-color 0.2s ease;
`;
