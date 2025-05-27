// src/components/mypage/BookmarkList.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import usePagination from '../../hooks/usePagination';
import Pagination from '../common/Pagination';
import bookmarkIcon from '../../assets/images/common/BookmarkFilledButton.png';
import { useNavigate } from 'react-router-dom';

const dummyIssueData = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  title: `관광 공공 데이터 공모전 (${i + 1})`,
  category: '환경',
  date: '2025.04.14',
}));

const dummyActivityData = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  title: `환경 공모전 (${i + 1})`,
  category: '#환경 #공모전',
  date: '2025.04.14',
}));

export default function BookmarkList() {
  const [selectedType, setSelectedType] = useState('issue');
  const data = selectedType === 'issue' ? dummyIssueData : dummyActivityData;

  const itemsPerPage = 10;
  const {
    currentPage,
    goToPage,
    totalPages,
    currentData: paginatedData,
  } = usePagination(data, itemsPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    goToPage(1);
  }, [selectedType, goToPage]);

  const handleTitleClick = (item) => {
    if (selectedType === 'issue') {
      navigate('/global-issue-detail', {
        state: {
          label: `#${item.category}`,
          title: item.title,
        },
      });
    } else {
      const firstKeyword = item.category.split(' ')[0];
      navigate(`/more-detail?query=${encodeURIComponent(firstKeyword)}`);
    }
  };

  return (
    <Wrapper>
      <CenteredToggleRow>
        <TabButton
          active={selectedType === 'issue'}
          onClick={() => setSelectedType('issue')}
        >
          글로벌 이슈
        </TabButton>
        <TabButton
          active={selectedType === 'activity'}
          onClick={() => setSelectedType('activity')}
        >
          활동
        </TabButton>
      </CenteredToggleRow>

      {paginatedData.length === 0 ? (
        <EmptyMessage>북마크한 항목이 없습니다.</EmptyMessage>
      ) : (
        <>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>제목</th>
                  <th>카테고리</th>
                  <th>날짜</th>
                  <th>북마크</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>
                      <TitleLink onClick={() => handleTitleClick(item)}>
                        {item.title}
                      </TitleLink>
                    </td>
                    <td>
                      {selectedType === 'issue' ? (
                        <CategoryTag>{item.category}</CategoryTag>
                      ) : (
                        <ActivityTag>{item.category}</ActivityTag>
                      )}
                    </td>
                    <td>{item.date}</td>
                    <td>
                      <BookmarkIcon src={bookmarkIcon} alt="bookmark" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>

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
}

const Wrapper = styled.div`
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CenteredToggleRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 150px;
  margin-bottom: 30px;
`;

const TabButton = styled.button`
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  background: ${({ active }) => (active ? '#235ba9' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

// 테이블 컨테이너: 폭 고정, 가운데 정렬, 상·하 테두리
const TableContainer = styled.div`
  width: 900px;
  max-width: 100%;
  margin: 0 auto;
  border-top: 2px solid #235ba9;
  border-bottom: 2px solid #235ba9;
  overflow-x: auto;
`;

// 테이블: 고정 레이아웃, 셀 크기·간격 고정
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th, td {
    padding: 12px 16px;
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border-top: 1px solid #d9e5f6;
  }

  th {
    background-color: #f5f9ff;
    color: #000;
    font-weight: 500;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 15px;
  }

  /* 컬럼별 너비 분배 */
  th:nth-child(1), td:nth-child(1) { width: 10%; }
  th:nth-child(2), td:nth-child(2) { width: 45%; }
  th:nth-child(3), td:nth-child(3) { width: 20%; }
  th:nth-child(4), td:nth-child(4) { width: 15%; }
  th:nth-child(5), td:nth-child(5) { width: 10%; }

  tr:nth-child(even) {
    background-color: #f7faff;
  }
`;

const TitleLink = styled.span`
  color: #000;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const CategoryTag = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: #34a853;
  background: #f6faff;
  border: 1px solid #34a853;
`;

const ActivityTag = styled.span`
  color: #235ba9;
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #888;
  font-size: 15px;
`;

const BookmarkIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const PaginationWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  width: 100%;
`;
