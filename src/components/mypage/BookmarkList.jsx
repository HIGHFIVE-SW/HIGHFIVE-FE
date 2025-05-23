import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import usePagination from '../../hooks/usePagination';
import Pagination from '../common/Pagination';
import bookmarkIcon from '../../assets/images/main/BookmarkFilledButton.png';
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

const BookmarkList = () => {
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
  }, [selectedType]);

const handleTitleClick = (item) => {
  if (selectedType === 'issue') {
    navigate('/global-issue-detail', {
      state: {
        label: `#${item.category}`,
        title: item.title,
      },
    });
  } else {
    const firstKeyword = item.category.split(' ')[0]; // "#환경"만 추출
    navigate(`/more-detail?query=${encodeURIComponent(firstKeyword)}`);
  }
};

  return (
    <Wrapper>
      <CenteredToggleRow>
        <TabButton active={selectedType === 'issue'} onClick={() => setSelectedType('issue')}>
          글로벌 이슈
        </TabButton>
        <TabButton active={selectedType === 'activity'} onClick={() => setSelectedType('activity')}>
          활동
        </TabButton>
      </CenteredToggleRow>

      {(paginatedData ?? []).length === 0 ? (
        <EmptyMessage>북마크한 항목이 없습니다.</EmptyMessage>
      ) : (
        <>
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
                      <span style={{ color: '#235ba9', fontWeight: 500 }}>{item.category}</span>
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

export default BookmarkList;

const Wrapper = styled.div`
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CenteredToggleRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 150px;
  margin-bottom: 30px;
  margin-right: -15%;
`;

const TabButton = styled.button`
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  background: ${({ active }) => (active ? '#235ba9' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: 2px solid #235BA9;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
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

const TitleLink = styled.span`
  color: #235ba9;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

const CategoryTag = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid #34A853;
  border-radius: 999px;
  font-size: 13px;
  color: #34A853;
  background: #F6FAFF;
`;

const EmptyMessage = styled.div`
  padding: 60px;
  text-align: center;
  color: #888;
  font-size: 15px;
`;

const BookmarkIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const PaginationWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  margin-right: 16%;
`;
