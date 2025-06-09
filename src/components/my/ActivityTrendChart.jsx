import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useMyMonthlyStats, useUserMonthlyStats } from '../../query/usePost';
import CustomDropdown from '../common/CustomDropdown';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// userId prop을 받아서 본인/다른 사용자 구분
const ActivityTrendChart = ({ userId = null }) => {
  // 조건부 API 호출 - userId가 있으면 특정 사용자, 없으면 내 통계
  const { data: myMonthlyStats, isLoading: myIsLoading, isError: myIsError } = useMyMonthlyStats({ enabled: !userId });
  const { data: userMonthlyStats, isLoading: userIsLoading, isError: userIsError } = useUserMonthlyStats(userId);
  
  // 실제 사용할 데이터 선택
  const monthlyStats = userId ? userMonthlyStats : myMonthlyStats;
  const isLoading = userId ? userIsLoading : myIsLoading;
  const isError = userId ? userIsError : myIsError;
  
  // 년도별 필터링을 위한 state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // 사용 가능한 년도 목록 추출 (최근 3년만, 데이터 유무 관계없이 모두 표시)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const recentThreeYears = [currentYear, currentYear - 1, currentYear - 2].map(year => year.toString());
    
    // 데이터 유무와 관계없이 항상 최근 3년을 모두 표시
    return recentThreeYears;
  }, []);

  // 첫 번째 데이터 로드 시 최신 년도로 자동 설정
  useMemo(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // API 데이터를 차트 형식으로 변환
  const chartData = useMemo(() => {
    console.log('월별 통계 데이터:', monthlyStats);
    console.log('선택된 년도:', selectedYear);
    
    if (!monthlyStats || monthlyStats.length === 0) {
      // 데이터가 없을 때 12개월 빈 데이터 생성
      return Array.from({ length: 12 }, (_, index) => ({
        month: `${index + 1}월`,
        count: 0
      }));
    }

    // 선택된 년도의 데이터만 필터링
    const filteredData = monthlyStats.filter(item => item.year.toString() === selectedYear);

    // 전체 12개월 데이터 배열 생성 (1월~12월)
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      return {
        month: `${monthNumber}월`,
        count: 0
      };
    });

    // API 데이터로 실제 값 업데이트
    filteredData.forEach(item => {
      const monthIndex = item.month - 1; // API는 1-12, 배열은 0-11
      if (monthIndex >= 0 && monthIndex < 12) {
        allMonths[monthIndex].count = item.count;
      }
    });

    return allMonths;
  }, [monthlyStats, selectedYear]);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <ChartCard>
        <ChartHeader>
          <ChartTitle>활동 경과</ChartTitle>
          <CustomDropdown
            options={[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map(year => year.toString())}
            selected={selectedYear}
            onSelect={setSelectedYear}
          />
        </ChartHeader>
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      </ChartCard>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <ChartCard>
        <ChartHeader>
          <ChartTitle>활동 경과</ChartTitle>
          <CustomDropdown
            options={[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map(year => year.toString())}
            selected={selectedYear}
            onSelect={setSelectedYear}
          />
        </ChartHeader>
        <ErrorMessage>데이터를 불러오는데 실패했습니다.</ErrorMessage>
      </ChartCard>
    );
  }

  console.log('ActivityTrendChart data:', chartData);

  return (
    <ChartCard>
      <ChartHeader>
        <ChartTitle>활동 경과</ChartTitle>
        <CustomDropdown
          options={availableYears}
          selected={selectedYear}
          onSelect={setSelectedYear}
        />
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #222;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #e74c3c;
  font-size: 16px;
`;