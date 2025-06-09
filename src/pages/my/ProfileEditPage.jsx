import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import InterestSelect from '../../components/interest/InterestSelect';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import { updateUserProfile, getUserProfile, logout, uploadProfileImage } from '../../api/userApi';
import judyIcon from '../../assets/images/level/ic_Judy.png';
import cameraIcon from '../../assets/images/profile/ic_ProfileCamera.png';

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState('');
  const [interest, setInterest] = useState('');
  const [profileImg, setProfileImg] = useState(judyIcon);
  const [profileImageFile, setProfileImageFile] = useState(null); // 선택된 파일 저장
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  // 현재 프로필 정보를 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setNickname(profile.nickname || '');
        setInterest(profile.keyword || '');
        setProfileImg(profile.profileUrl || judyIcon);
      } catch (error) {
        console.error('프로필 로드 실패:', error);
        // 실패시 localStorage에서 가져오기 (fallback)
        setNickname(localStorage.getItem('nickname') || '');
        setInterest(localStorage.getItem('keyword') || '');
        const savedImage = localStorage.getItem('profileImg');
        setProfileImg(savedImage || judyIcon);
      }
    };

    loadProfile();
  }, []);

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 파일 크기는 5MB 이하만 업로드 가능합니다.');
        return;
      }

      // 파일 형식 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setIsImageUploading(true);

      try {
        console.log('이미지 업로드 시작:', file);
        
        // S3에 이미지 업로드
        const uploadedImageUrl = await uploadProfileImage(file);
        
        console.log('업로드된 이미지 URL:', uploadedImageUrl);
        
        // 업로드된 URL을 상태에 저장
        setProfileImg(uploadedImageUrl);
        setProfileImageFile(file); // 파일도 저장 (미리보기용)
        
        alert('이미지가 성공적으로 업로드되었습니다.');
        
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert(`이미지 업로드에 실패했습니다.\n${error.message}`);
      } finally {
        setIsImageUploading(false);
      }
    } else {
      setProfileImg(judyIcon);
      setProfileImageFile(null);
    }
  };

  const handleComplete = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    
    if (!interest) {
      alert('관심분야를 선택해주세요.');
      return;
    }

    if (!window.confirm(`닉네임: ${nickname}\n관심분야: ${interest}\n\n위 정보로 수정하시겠습니까?`)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const updateData = {
        nickname: nickname.trim(),
        keyword: interest,
        profileUrl: profileImg === judyIcon ? null : profileImg
      };

      console.log('프로필 수정 요청:', updateData);
      
      const result = await updateUserProfile(updateData);
      
      console.log('프로필 수정 성공:', result);

      // localStorage도 업데이트 (동기화)
      localStorage.setItem('nickname', result.nickname);
      localStorage.setItem('keyword', result.keyword);
      if (result.profileUrl) {
        localStorage.setItem('profileUrl', result.profileUrl);
      }

      alert('프로필이 성공적으로 수정되었습니다.');
      navigate('/mypage');
      
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert(`프로필 수정에 실패했습니다.\n${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleLogout = async () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      try {
        await logout();
        alert('로그아웃되었습니다.');
        navigate('/');
      } catch (error) {
        console.error('로그아웃 처리 중 오류:', error);
        // 에러가 발생해도 로그아웃 처리
        navigate('/');
      }
    }
  };

  return (
    <Wrapper>
      <MainNav />
      <Body>
        <ProfileSection>
          <ImageWrapper>
            <ProfileImage src={profileImg} alt="profile" />
            <EditIconButton 
              onClick={handleCameraClick}
              disabled={isImageUploading}
            >
              <EditIcon src={cameraIcon} alt="edit" />
            </EditIconButton>
            {isImageUploading && <UploadingOverlay>업로드 중...</UploadingOverlay>}
            <HiddenInput
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isImageUploading}
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

        <SubmitButton 
          onClick={handleComplete} 
          disabled={isLoading || isImageUploading}
        >
          {isLoading ? '수정 중...' : '수정 완료'}
        </SubmitButton>
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
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: opacity 0.2s ease;
`;

const UploadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 500;
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
  background-color: ${({ disabled }) => disabled ? '#ccc' : '#235BA9'};
  color: white;
  border: none;
  border-radius: 30px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  margin-top: 40px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ disabled }) => disabled ? '#ccc' : '#1e4a8a'};
  }
`;

const Logout = styled.div`
  margin-top: 40px;
  color: #888;
  text-decoration: underline;
  text-underline-offset: 10px; 
  cursor: pointer;
`;