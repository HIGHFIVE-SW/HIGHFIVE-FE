import React from "react";
import styled from "styled-components";

const Pagination = ({ currentPage, totalPages, goToPage }) => {
  const pagesPerGroup = 5;
  const groupStart = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const groupEnd = Math.min(groupStart + pagesPerGroup - 1, totalPages);

  const pages = [];
  for (let i = groupStart; i <= groupEnd; i++) {
    pages.push(i);
  }

  return (
    <Wrapper>
      <NavButton onClick={() => goToPage(groupStart - 1)} disabled={groupStart === 1}>
        &lt;
      </NavButton>
      {pages.map((page) => (
        <PageButton
          key={page}
          onClick={() => goToPage(page)}
          active={page === currentPage}
        >
          {page}
        </PageButton>
      ))}
      <NavButton onClick={() => goToPage(groupEnd + 1)} disabled={groupEnd === totalPages}>
        &gt;
      </NavButton>
    </Wrapper>
  );
};

export default Pagination;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 24px 0;
`;

const NavButton = styled.button`
  padding: 6px 12px;
  border: none;
  color: #000;
  background-color: #fff;
  cursor: pointer;
  border-radius: 6px;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PageButton = styled.button`
  padding: 6px 12px;
  background-color: ${(props) => (props.active ? "#F6FAFF" : "#fff")};
  color: ${(props) => (props.active ? "#235ba9" : "#000")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  border: 1px solid #fff;
  border-radius: 6px;
  cursor: pointer;
`;
