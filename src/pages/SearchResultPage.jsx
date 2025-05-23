import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import IssueCard from '../components/IssueCard';
import ActivityCard from '../components/activity/ActivityCard';

import globalImage from '../assets/images/main/ic_IssueCardSample.png';
import activityImage from '../assets/images/activity/ic_ActivityImage.png';
import SearchIcon from '../assets/images/nav/ic_Search.png';

import { useLocation,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const dummyGlobalIssues = [
  { id: 1, title: '글로벌 관세 전쟁 공포', tag: '#경제', image: globalImage },
  { id: 2, title: '기후 변화와 탄소 중립 경제', tag: '#환경', image: globalImage },
  { id: 3, title: 'AI 기술의 미래와 사회 변화 경제', tag: '#기술', image: globalImage },
  { id: 4, title: '세계 경제 포럼: 글로벌 정책 전환 경제', tag: '#정치', image: globalImage },
];

const dummyActivities = [
  { id: 1, title: '제 22회 한국 경제 논문 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 2, title: '환경 인턴십', tags: ['#환경', '#인턴십'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 3, title: '기술 봉사활동', tags: ['#기술', '#봉사활동'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 4, title: '제 22회 한국 경제 논문 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 5, title: '제 22회 한국 경제 논문 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 6, title: '제 22회 한국 경제 논문 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage },
];

export default function SearchResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef();
  
    const [bookmarkedGlobalIds, setBookmarkedGlobalIds] = useState([]);
    const [bookmarkedActivityIds, setBookmarkedActivityIds] = useState([]);
  
    const toggleGlobalBookmark = (id) => {
      setBookmarkedGlobalIds((prev) =>
        prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
      );
    };
  
    const toggleActivityBookmark = (id) => {
      setBookmarkedActivityIds((prev) =>
        prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
      );
    };
  
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const queryFromURL = params.get('query');
      if (queryFromURL) {
        setInputValue(queryFromURL);
        setSearchQuery(queryFromURL);
      }
    }, [location.search]);
  
    const handleSearch = () => {
      if (inputValue.trim()) {
        navigate(`/search?query=${inputValue.trim()}`);
      }
    };
    
    const lowerQuery = searchQuery.toLowerCase();
  
    const filteredGlobal = dummyGlobalIssues.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.tag.toLowerCase().includes(lowerQuery)
    );
  
    const filteredActivities = dummyActivities.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  
    return (
      <Wrapper>
        <MainNav />
        <Content>
          <SearchHeader>
            <SearchBox>
              <SearchInput
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.target.value);
                  }
                }}
                placeholder="검색어를 입력해주세요."
              />
              <SearchIconImg
                src={SearchIcon}
                alt="검색"
                onClick={() => handleSearch(inputValue)}
              />
            </SearchBox>
          </SearchHeader>
  
          {searchQuery && (
            <>
              <ResultTitle>‘{searchQuery}’의 검색 결과</ResultTitle>
  
              {filteredGlobal.length === 0 && filteredActivities.length === 0 ? (
                <NoResult>검색 결과가 없습니다.</NoResult>
              ) : (
                <>
                  {filteredGlobal.length > 0 && (
                    <Section>
                      <SectionHeader>
                        <h3>글로벌 이슈</h3>
                        <MoreBtn onClick={() => navigate(`/more/global?query=${searchQuery}`)}>더보기 &gt;</MoreBtn>
                      </SectionHeader>
                      <CardGrid>
                        {filteredGlobal.map((item) => (
                          <IssueCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            tag={item.tag}
                            image={item.image}
                            bookmarked={bookmarkedGlobalIds.includes(item.id)}
                            onToggle={() => toggleGlobalBookmark(item.id)}
                          />
                        ))}
                      </CardGrid>
                    </Section>
                  )}
  
                  {filteredActivities.length > 0 && (
                    <Section>
                      <SectionHeader>
                        <h3>활동</h3>
                        <MoreBtn onClick={() => navigate(`/more/activity?query=${searchQuery}`)}>더보기 &gt;</MoreBtn>
                      </SectionHeader>
                      <CardGrid>
                        {filteredActivities.map((item) => (
                          <ActivityCard
                            key={item.id}
                            title={item.title}
                            tags={item.tags.join(' ')}
                            image={item.image}
                            date={item.date}
                            bookmarked={bookmarkedActivityIds.includes(item.id)}
                            onToggle={() => toggleActivityBookmark(item.id)}
                          />
                        ))}
                      </CardGrid>
                    </Section>
                  )}
                </>
              )}
            </>
          )}
        </Content>
        <Footer />
      </Wrapper>
    );
  }
  

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  padding: 40px 80px;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 480px;
  height: 44px;
  border: 2px solid #235ba9;
  border-radius: 8px;
  padding: 0 12px;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  flex: 1;
  font-size: 16px;
  border: none;
  outline: none;
`;

const SearchIconImg = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ResultTitle = styled.h2`
  font-size: 40px;
  margin-bottom: 20px;
  margin-left: -52px;
`;

const Section = styled.div`
  padding: 20px 60px 40px 80px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 16px;
  margin-left: -80px;

  h3 {
    font-size: 20px;
    align-self: flex-start;
    margin-bottom: 4px;
    margin-left: -43px;
    color: #999999;
  }
`;

const MoreBtn = styled.span`
  font-size: 14px;
  color: #111;
  cursor: pointer;
  margin-right: -95px;
  margin-bottom: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
  margin-left: -123px;
`;

const NoResult = styled.p`
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 40px;
`;