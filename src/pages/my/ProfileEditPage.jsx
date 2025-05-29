import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import InterestSelect from '../../components/interest/InterestSelect';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import judyIcon from '../../assets/images/level/ic_Judy.png';
import cameraIcon from '../../assets/images/profile/ic_ProfileCamera.png';

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState('');
  const [interest, setInterest] = useState('');
  const [profileImg, setProfileImg] = useState(() => {
    const savedImage = localStorage.getItem('profileImg');
    return savedImage ? savedImage : judyIcon;
  });
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        localStorage.setItem('profileImg', reader.result); // 저장
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImg(judyIcon);
      localStorage.removeItem('profileImg'); //지우기
    }
  };

  const handleComplete = () => {
    if (window.confirm(`${nickname} / 관심분야: ${interest}\n\n위 정보로 수정하시겠습니까?`)) {
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('keyword', interest);
      localStorage.setItem('profileUrl', profileImg);
      navigate('/mypage');
    }
  };  

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Wrapper>
      <MainNav />
      <Body>
        <ProfileSection>
          <ImageWrapper>
            <ProfileImage src={profileImg} alt="profile" />
            <EditIconButton onClick={handleCameraClick}>
              <EditIcon src={cameraIcon} alt="edit" />
            </EditIconButton>
            <HiddenInput
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </ImageWrapper>

          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
          />
        </ProfileSection>

        <SectionTitle>관심분야 선택</SectionTitle>
        <InterestSelect selected={interest} onSelect={setInterest} />

        <SubmitButton onClick={handleComplete}>수정 완료</SubmitButton>
        <Logout onClick={handleLogout}>로그아웃</Logout> 
      </Body>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 20px;
  border-radius: 50%;
  border: 2px solid #235BA9;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const EditIconButton = styled.button`
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff;
  border: none;
  padding: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
`;

const EditIcon = styled.img`
  width: 100%;
  height: 100%;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Input = styled.input`
  padding: 10px 20px;
  font-size: 16px;
  border: 2px solid #235BA9;
  border-radius: 8px;
  width: 280px;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 20px;
  align-self: flex-start;
  margin-left: 230px; 
`;

const SubmitButton = styled.button`
  width: 189px;
  height: 64px;
  padding: 12px;
  font-size: 20px;
  font-family: 'NotoSansCustom';
  font-weight: 600;
  background-color: #235BA9;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 40px;
`;

const Logout = styled.button`
  width: 189px;
  height: 64px;
  padding: 12px;
  font-size: 20px;
  font-family: 'NotoSansCustom';
  font-weight: 600;
  background-color: #C4C4C4;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 16px;
`;