import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { searchActivities } from "../../api/MainSearchApi";
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../utils/formatDate';

export default function ActivitySearchInput({ 
  value, 
  onChange, 
  onActivitySelect,
  placeholder = "후기를 작성할 대외활동을 검색하세요",
  allowClosed = true // 후기 게시판에서는 마감된 활동도 허용
}) {
  const [query, setQuery] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const wrapperRef = useRef();

  // 검색어 디바운싱 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 활동 검색 데이터 가져오기
  const { 
    data: searchResult, 
    isLoading,
    isError 
  } = useQuery({
    queryKey: ['activities', 'search', debouncedQuery],
    queryFn: () => searchActivities({ 
      keyword: debouncedQuery, 
      page: 0, 
      size: 8 // 검색 결과 8개로 제한
    }),
    enabled: isFocused && debouncedQuery.length > 1,
    staleTime: 1000 * 60 * 3, // 3분
    cacheTime: 1000 * 60 * 5, // 5분
  });

  const activities = searchResult?.isSuccess ? searchResult.result.content : [];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 외부에서 value가 변경될 때 query 업데이트
  useEffect(() => {
    if (value !== query) {
      setQuery(value || "");
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    
    // 입력값이 비어있으면 선택된 활동 초기화
    if (newValue === "" && onActivitySelect) {
      onActivitySelect(null);
    }
  };

  const handleActivitySelect = (activity) => {
    setQuery(activity.name);
    onChange(activity.name);
    if (onActivitySelect) {
      onActivitySelect(activity);
    }
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // 활동 마감 여부 확인
  const isActivityClosed = (endDate) => {
    if (!endDate) return false;
    const now = new Date();
    const end = new Date(endDate);
    return end < now;
  };

  // 검색 결과가 있는지 확인
  const hasResults = activities && activities.length > 0;
  const showNoResults = isFocused && debouncedQuery.length > 1 && !isLoading && !hasResults && !isError;
  const showResults = isFocused && debouncedQuery.length > 1 && (hasResults || isLoading || showNoResults || isError);

  return (
    <Wrapper ref={wrapperRef}>
      <Input
        value={query}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      
      {showResults && (
        <ResultList>
          {isLoading && (
            <ResultItem disabled>
              <LoadingText>검색 중...</LoadingText>
            </ResultItem>
          )}
          
          {isError && (
            <ResultItem disabled>
              <ErrorText>검색 중 오류가 발생했습니다</ErrorText>
            </ResultItem>
          )}
          
          {hasResults && !isLoading && 
            activities.map((activity) => {
              const isClosed = isActivityClosed(activity.endDate);
              return (
                <ResultItem
                  key={activity.id}
                  onClick={() => handleActivitySelect(activity)}
                  disabled={false} // 후기 게시판에서는 모든 활동 선택 가능
                >
                  <ActivityInfo>
                    <ActivityName $closed={isClosed}>
                      {activity.name}
                    </ActivityName>
                    <ActivityMeta>
                      <ActivityTag type={activity.activityType}>
                        {activity.activityType}
                      </ActivityTag>
                      <ActivityKeyword>{activity.keyword}</ActivityKeyword>
                      <ActivityDate>
                        {formatDate(activity.startDate)} ~ {formatDate(activity.endDate)}
                      </ActivityDate>
                    </ActivityMeta>
                  </ActivityInfo>
                  {isClosed ? (
                    <CompletedBadge>완료</CompletedBadge>
                  ) : (
                    <OngoingBadge>진행중</OngoingBadge>
                  )}
                </ResultItem>
              );
            })
          }
          
          {showNoResults && (
            <ResultItem disabled>
              <NoResultText>
                "{debouncedQuery}"에 대한 검색 결과가 없습니다
              </NoResultText>
            </ResultItem>
          )}
        </ResultList>
      )}
    </Wrapper>
  );
}

// 스타일드 컴포넌트들
const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 14px;
  border: 1px solid #235ba9;
  border-radius: 6px;
  width: 100%;
  height: 22px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #1a4480;
    box-shadow: 0 0 0 2px rgba(35, 91, 169, 0.1);
  }

  &::placeholder {
    color: #aaa;
    font-size: 14px;
  }
`;

const ResultList = styled.ul`
  position: absolute;
  top: 100%;
  width: 100%;
  background: white;
  border: 1px solid #dcdcdc;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
`;

const ResultItem = styled.li`
  padding: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : '#f2f8ff'};
  }
    
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
  min-width: 0;
`;


const ActivityName = styled.div`
  font-weight: 600;
  color: ${props => props.$closed ? '#666' : '#333'};
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none; // 후기 게시판에서는 줄 긋지 않음
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActivityTag = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  background: ${props => {
    switch(props.type) {
      case '공모전': return '#e74c3c';
      case '봉사활동': return '#27ae60';
      case '인턴십': return '#3498db';
      case '서포터즈': return '#9b59b6';
      default: return '#95a5a6';
    }
  }};
`;

const ActivityKeyword = styled.span`
  font-size: 11px;
  color: #666;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 8px;
`;

const ActivityDate = styled.span`
  font-size: 11px;
  color: #888;
`;

// 완료된 활동을 위한 배지 (긍정적인 의미)
const CompletedBadge = styled.span`
  background: #27ae60;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

// 진행중인 활동을 위한 배지
const OngoingBadge = styled.span`
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const LoadingText = styled.span`
  color: #666;
  font-style: italic;
`;

const ErrorText = styled.span`
  color: #e74c3c;
`;

const NoResultText = styled.span`
  color: #888;
`;
