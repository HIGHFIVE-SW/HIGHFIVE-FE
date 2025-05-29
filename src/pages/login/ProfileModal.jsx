import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import avatar from '../../assets/images/profile/DefaultProfile.png';
import cameraIcon from '../../assets/images/profile/ic_ProfileCamera.png';
import InterestModal from './InterestModal';
import NotoSansKR from '../../assets/fonts/NotoSansKR-VariableFont_wght.ttf';

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
  const fileInputRef = useRef();

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result); // base64 저장
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (nickname.trim()) {
      setShowInterestModal(true);
    }
  };

  return (
    <>
      <GlobalFontStyle />
      <ModalOverlay onClick={onClose}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <h2>프로필을 설정해주세요.</h2>

          <ProfileImageWrapper>
            <img src={profileImg} alt="avatar" />
            <CameraIcon onClick={handleCameraClick} />
            <HiddenFileInput
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
            />
          </ProfileImageWrapper>

          <NicknameInput
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="닉네임을 입력해 주세요."
            hasText={nickname.trim().length > 0}
            isFocused={isFocused}
          />

          <NextButton onClick={handleNext} active={nickname.trim().length > 0}>
            다음
          </NextButton>
        </ModalBox>
      </ModalOverlay>

      {showInterestModal && (
        <InterestModal
          onClose={onClose}
          nickname={nickname}
          profileUrl={profileImg}
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
  cursor: pointer;
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
    ${({ isFocused, hasText }) =>
      isFocused || hasText ? '#235BA9' : '#C4C4C4'};
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
  background-color: ${({ active }) => (active ? '#235BA9' : '#C4C4C4')};
  color: white;
  border: none;
  border-radius: 30px;
  cursor: ${({ active }) => (active ? 'pointer' : 'default')};
  transition: background-color 0.2s ease;
`;