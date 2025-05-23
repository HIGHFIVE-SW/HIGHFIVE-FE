import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';

const ActivityTypeChart = () => {
  const [selected, setSelected] = useState('분야');

  const fieldData = [
    { name: '전체', count: 15 },
    { name: '환경', count: 8 },
    { name: '사람과 사회', count: 2 },
    { name: '경제', count: 2 },
    { name: '기술', count: 3 },
  ];

  const typeData = [
    { name: '전체', count: 15 },
    { name: '봉사', count: 8 },
    { name: '캠페인', count: 2 },
    { name: '공모전', count: 5 },
  ];

  const data = selected === '분야' ? fieldData : typeData;

  return (
    <ChartWrapper>
      <Header>
        <Title>분야별 활동 기록</Title>
        <Dropdown value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="분야">분야</option>
          <option value="유형">유형</option>
        </Dropdown>
      </Header>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Bar
            dataKey="count"
            fill="#235ba9"
            radius={[10, 10, 0, 0]}
            label={{ position: 'top', fill: '#000', fontWeight: 700 }}
            />
        </BarChart>
    </ResponsiveContainer>

    </ChartWrapper>
  );
};

export default ActivityTypeChart;

const ChartWrapper = styled.div`
  width: 100%;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h4`
  font-size: 16px;
  font-weight: 600;
`;

const Dropdown = styled.select`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: #fff;
  color: #333;
`;
