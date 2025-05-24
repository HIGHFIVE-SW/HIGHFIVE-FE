import React from 'react';
import styled from 'styled-components';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const trendData = [
  { month: '1월', count: 11 },
  { month: '2월', count: 5 },
  { month: '3월', count: 13 },
  { month: '4월', count: 8 },
  { month: '5월', count: 15 },
  { month: '6월', count: 4 },
  { month: '7월', count: 12 },
  { month: '8월', count: 3 },
  { month: '9월', count: 4 },
  { month: '10월', count: 2 },
  { month: '11월', count: 9 },
  { month: '12월', count: 15 },
];

const ActivityTrendChart = () => {
  console.log('ActivityTrendChart data:', trendData);

  return (
    <ChartCard>
      <ChartHeader>
        <ChartTitle>활동 경과</ChartTitle>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#888" />
          <YAxis hide />
          <Tooltip contentStyle={{ borderRadius: '10px', backgroundColor: '#f6faff', border: '1px solid #ccc' }} />
          <Line
            type="linear"
            dataKey="count"
            stroke="#235BA9"
            strokeWidth={5}
            dot={{ r: 6, stroke: '#235BA9', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default ActivityTrendChart;

const ChartCard = styled.div`
  width: 900px;
  height: 400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
`;

const ChartHeader = styled.div`
  margin-bottom: 24px;
`;

const ChartTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #222;
`;

