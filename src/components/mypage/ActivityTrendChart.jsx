import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';

const dummyMonthlyTrend = [
  { month: '1월', count: 5 },
  { month: '2월', count: 8 },
  { month: '3월', count: 4 },
  { month: '4월', count: 6 },
  { month: '5월', count: 3 },
  { month: '6월', count: 7 },
  { month: '7월', count: 2 },
  { month: '8월', count: 4 },
  { month: '9월', count: 1 },
  { month: '10월', count: 5 },
  { month: '11월', count: 6 },
  { month: '12월', count: 9 },
];

const ActivityTrendChart = () => {
  return (
    <GraphBlock>
      <SectionTitle>활동 경과</SectionTitle>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dummyMonthlyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#235ba9" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </GraphBlock>
  );
};

export default ActivityTrendChart;

const GraphBlock = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
`;
