import React from 'react';
import styled from 'styled-components';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <PaginationWrapper>
      {Array.from({ length: totalPages }).map((_, i) => (
        <PageBtn
          key={i + 1}
          active={currentPage === i + 1}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </PageBtn>
      ))}
      {currentPage < totalPages && (
        <NextBtn onClick={() => onPageChange(currentPage + 1)}>
          NEXT &gt;
        </NextBtn>
      )}
    </PaginationWrapper>
  );
}

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 40px 0 60px;
`;

const PageBtn = styled.button`
  background-color: ${(props) =>
    props.active ? '#F6FAFF' : 'transparent'};
  color: ${(props) => (props.active ? '#1D4ED8' : '#000')};
  border: none;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const NextBtn = styled.button`
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
`;
