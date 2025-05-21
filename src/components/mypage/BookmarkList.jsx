import React, { useState } from 'react';
import styled from 'styled-components';
import bookmarkIcon from '../../assets/images/main/BookmarkFilledButton.png';

const BookmarkList = ({ issueData, activityData }) => {
  const [selectedType, setSelectedType] = useState('issue');

  const data = selectedType === 'issue' ? issueData : activityData;

  return (
    <Wrapper>
      <ToggleRow>
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
      </ToggleRow>

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
          {data.map((item, idx) => (
            <tr key={item.id}>
              <td>{idx + 1}</td>
              <td>{item.title}</td>
              <td>
                {selectedType === 'issue' ? (
                  <CategoryTag>{item.category}</CategoryTag>
                ) : (
                  <span style={{ color: '#235ba9', fontWeight: 500 }}>{item.category}</span>
                )}
              </td>
              <td>{item.date}</td>
              <td>
                <img src={bookmarkIcon} alt="bookmark" width="20" height="20" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default BookmarkList;

const Wrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 180%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  background: ${({ active }) => (active ? '#235ba9' : '#eee')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    text-align: center;
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
  }

  thead tr {
    background: #f9f9f9;
  }
`;

const CategoryTag = styled.div`
  display: inline-block;
  padding: 2px 10px;
  border: 1px solid #00a651;
  border-radius: 999px;
  font-size: 13px;
  color: #00a651;
  background: #f3fef6;
`;
