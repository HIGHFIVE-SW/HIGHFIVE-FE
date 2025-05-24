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
  }, []);

  
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
                  <td><BoardTag>{post.board}</BoardTag></td>
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
  width: 140%;
  border-collapse: collapse;
  margin-right: -40%;
  border-top: 2px solid #235ba9;
  border-bottom: 2px solid #235ba9;

  th {
    background-color: #f5f9ff;
    color: #235ba9;
    font-weight: 700;
    font-size: 15px;
    padding: 14px 0;
  }

  td {
    padding: 12px 0;
    font-size: 14px;
    color: #333;
    border-top: 1px solid #d9e5f6;
  }

  tr:nth-child(even) {
    background-color: #f7faff;
  }

  td, th {
    text-align: center;
  }
`;

const BoardTag = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: #235ba9;
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
  margin-right: 16%;
`;