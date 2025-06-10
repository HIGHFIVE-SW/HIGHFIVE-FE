import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, LabelList
} from 'recharts';
import styled from 'styled-components';
import CustomDropdown from '../../components/common/CustomDropdown';
import { useMyKeywordStats, useMyActivityTypeStats, useUserKeywordStats, useUserActivityTypeStats } from '../../query/usePost'; 

// 키워드 매핑
const KEYWORD_MAP = {
  'Environment': '환경',
  'PeopleAndSociety': '사람과 사회',
  'Economy': '경제', 
  'Technology': '기술'
};

// 활동 유형 매핑
const ACTIVITY_TYPE_MAP = {
  'CONTEST': '공모전',
  'VOLUNTEER': '봉사활동',
  'INTERNSHIP': '인턴십',
  'SUPPORTERS': '서포터즈'
};

const chartOptions = ['분야', '유형'];

export default function ActivityTypeSwitcherChart({ userId }) {
  const [mode, setMode] = useState('분야');
  
  // 내 통계 데이터 가져오기
  const { data: myKeywordStats, isLoading: myKeywordLoading, isError: myKeywordError } = useMyKeywordStats();
  const { data: myActivityTypeStats, isLoading: myTypeLoading, isError: myTypeError } = useMyActivityTypeStats();
  
  // 특정 사용자 통계 데이터 가져오기
  const { data: userKeywordStats, isLoading: userKeywordLoading, isError: userKeywordError } = useUserKeywordStats(userId);
  const { data: userActivityTypeStats, isLoading: userTypeLoading, isError: userTypeError } = useUserActivityTypeStats(userId);

  // userId 유무에 따라 데이터 선택
  const keywordStats = userId ? userKeywordStats : myKeywordStats;
  const activityTypeStats = userId ? userActivityTypeStats : myActivityTypeStats;
  
  // 분야별 데이터 처리
  const dataByField = useMemo(() => {
    console.log('키워드 통계 데이터:', keywordStats);
    
    if (!keywordStats || keywordStats.length === 0) {
      return [{ name: '전체', value: 0 }];
    }

    // API 데이터를 차트 형식으로 변환
    const fieldData = keywordStats.map(item => ({
      name: KEYWORD_MAP[item.keyword] || item.keyword,
      value: item.count
    }));

    // 전체 값 계산
    const totalValue = keywordStats.reduce((sum, item) => sum + item.count, 0);
    
    return [
      { name: '전체', value: totalValue },
      ...fieldData
    ];
  }, [keywordStats]);

  // 유형별 데이터 처리
  const dataByType = useMemo(() => {
    console.log('활동 유형 통계 데이터:', activityTypeStats);
    
    if (!activityTypeStats || activityTypeStats.length === 0) {
      return [{ name: '전체', value: 0 }];
    }

    // API 데이터를 차트 형식으로 변환
    const typeData = activityTypeStats.map(item => ({
      name: ACTIVITY_TYPE_MAP[item.activityType] || item.activityType,
      value: item.count
    }));

    // 전체 값 계산
    const totalValue = activityTypeStats.reduce((sum, item) => sum + item.count, 0);
    
    return [
      { name: '전체', value: totalValue },
      ...typeData
    ];
  }, [activityTypeStats]);

  const chartData = mode === '분야' ? dataByField : dataByType;
  const chartTitle = mode === '분야' ? '분야별 활동 기록' : '유형별 활동 기록';

  // 현재 모드와 userId에 따른 로딩/에러 상태 결정
  const isLoading = mode === '분야' 
    ? (userId ? userKeywordLoading : myKeywordLoading)
    : (userId ? userTypeLoading : myTypeLoading);
    
  const isError = mode === '분야' 
    ? (userId ? userKeywordError : myKeywordError)
    : (userId ? userTypeError : myTypeError);

  // 로딩 상태 처리
  if (isLoading) {
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
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      </ChartCard>
    );
  }

  // 에러 상태 처리
  if (isError) {
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
        <ErrorMessage>데이터를 불러오는데 실패했습니다.</ErrorMessage>
      </ChartCard>
    );
  }

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
        <BarChart data={chartData} margin={{ top: 40, right: 30, left: 10, bottom: 10 }}>
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