import React from "react";
import styled from "styled-components";
import warningIcon from "../../assets/images/board/ic_warning.png";

export default function AwardAlertModal({ onClose, onResubmit }) {
  return (
    <AlertOverlay>
      <AlertBox>
        <IconImage src={warningIcon} alt="경고 아이콘" />
        <AlertMessage>
          아쉽게도 제출하신 수상 기록이 검증되지 않아 <br />
          포인트 지급이 완료되지 않았습니다.
        </AlertMessage>
        <ButtonGroup>
          <GrayButton onClick={onClose}>확인</GrayButton>
          <BlueButton onClick={onResubmit}>다시 제출하기</BlueButton>
        </ButtonGroup>
      </AlertBox>
    </AlertOverlay>
  );
}

const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const AlertBox = styled.div`
  background: white;
  padding: 30px 24px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const IconImage = styled.img`
  width: 40px;
  height: 40px;
`;

const AlertMessage = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const GrayButton = styled.button`
  background-color: #c4c4c4;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const BlueButton = styled.button`
  background-color: #235ba9;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;