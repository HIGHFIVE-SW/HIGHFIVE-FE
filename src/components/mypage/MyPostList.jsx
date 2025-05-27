// src/components/mypage/MyPostsList.jsx

import React, { useEffect } from 'react';
import styled from 'styled-components';
import usePagination from '../../hooks/usePagination';
import Pagination from '../common/Pagination';

const dummyPosts = Array.from({ length: 21 }, (_, i) => ({
  id: i + 1,
  board: i % 2 === 0 ? '후기 게시판' : '자유 게시판',
  title: `관광 공공 데이터 공모전 나갈 사람? (${i + 1})`,
  date: '2025.04.14',
}));

const MyPostsList = () => {
  const itemsPerPage = 10;

  const {
    currentPage,
    goToPage,
    totalPages,
    currentData: paginatedPosts,
  } = usePagination(dummyPosts, itemsPerPage);

  useEffect(() => {
    goToPage(1); // 1페이지로 초기화
  }, [goToPage]);

  return (
    <Wrapper>
      {(paginatedPosts ?? []).length === 0 ? (
        <EmptyMessage>작성한 글이 없습니다.</EmptyMessage>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>게시판</th>
                <th>제목</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post, idx) => (
                <tr key={post.id}>
                  <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td>
                    <BoardTag board={post.board}>
                      {post.board}
                    </BoardTag>
                  </td>
                  <td>{post.title}</td>
                  <td>{post.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationWrapper>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          </PaginationWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default MyPostsList;



const Wrapper = styled.div`
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Table = styled.table`
  width: 900px;
  max-width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
  border-top: 2px solid #235ba9;
  border-bottom: 2px solid #235ba9;

  th {
    background-color: #f5f9ff;
    color: #000;
    font-weight: 500;
    font-size: 15px;
    padding: 14px 0;
    height: 30px;
  }

  td {
    padding: 12px 0;
    font-size: 14px;
    color: #333;
    border-top: 1px solid #d9e5f6;
    height: 30px;
  }

  tr:nth-child(even) {
    background-color: #f7faff;
  }

  td,
  th {
    text-align: center;
  }
`;

const BoardTag = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: ${({ board }) =>
    board === '자유 게시판' ? '#1C4987' : '#235ba9'};
  color: #fff;
  font-size: 13px;
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #888;
  font-size: 15px;
`;

const PaginationWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
`;
