import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, LabelList
} from 'recharts';
import styled from 'styled-components';
import CustomDropdown from '../../components/common/CustomDropdown'; 

const dataByField = [
  { name: '전체', value: 15 },
  { name: '환경', value: 8 },
  { name: '사람과 사회', value: 2 },
  { name: '경제', value: 2 },
  { name: '기술', value: 3 },
];

const dataByType = [
  { name: '전체', value: 15 },
  { name: '공모전', value: 8 },
  { name: '봉사활동', value: 2 },
  { name: '서포터즈', value: 5 },
  { name: '인턴십', value: 5 },
];

const chartOptions = ['분야', '유형'];

export default function ActivityTypeSwitcherChart() {
  const [mode, setMode] = useState('분야');

  const chartData = mode === '분야' ? dataByField : dataByType;
  const chartTitle = mode === '분야' ? '분야별 활동 기록' : '유형별 활동 기록';

  return (
    <ChartCard>
      <ChartHeader>
        <ChartTitle>{chartTitle}</ChartTitle>
        <CustomDropdown
          options={chartOptions}
          selected={mode}
          onSelect={setMode}
        />
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" allowDecimals={false} />
          <Bar
            dataKey="value"
            fill="#235BA9"
            radius={[10, 10, 0, 0]}
            barSize={40}
          >
            <LabelList dataKey="value" position="top" fill="#000" fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const ChartCard = styled.div`
  width: 900px;
  height: 400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #222;
`;