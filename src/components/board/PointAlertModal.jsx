import React from "react";
import styled from "styled-components";
import checkIcon from "../../assets/images/board/ic_check.png";

export default function PointAlertModal({ onClose }) {
  return (
    <AlertOverlay>
      <AlertBox>
        <IconImage src={checkIcon} alt="확인 아이콘" />
        <AlertMessage>
          제출해주신 자료는 정상적으로 확인되었습니다. <br /> 포인트와 랭킹은 6시간마다 반영됩니다.
        </AlertMessage>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
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

const ConfirmButton = styled.button`
  background-color: #235ba9;
  color: white;
  border: none;
  padding: 8px 25px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;
