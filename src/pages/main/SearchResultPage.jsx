// src/pages/SearchResultPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MainNav from '../../layout/MainNav';
import Footer from '../../layout/Footer';
import IssueCard from '../../components/issue/IssueCard';
import ActivityCard from '../../components/activity/ActivityCard';
import activityImage from '../../assets/images/activity/ic_ActivityImage.png';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/search/SearchBar';
import { searchIssues } from '../../api/MainSearchApi';


const dummyActivities = [
  { id: 1, title: '제 22회 한국 경제 논문 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 2, title: '환경 인턴십',                tags: ['#환경', '#인턴십'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 3, title: '기술 봉사활동',             tags: ['#기술', '#봉사활동'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 4, title: '제 22회 한국 경제 논문 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 5, title: '제 22회 한국 경제 논문 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage },
  { id: 6, title: '제 22회 한국 경제 논문 공모전', tags: ['#경제', '#공모전'], date: '2025.04.15~2025.04.20', image: activityImage },
];

export default function SearchResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef();

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedGlobalIds, setBookmarkedGlobalIds] = useState([]);
  const [bookmarkedActivityIds, setBookmarkedActivityIds] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromURL = params.get('query');
    if (queryFromURL) {
      setInputValue(queryFromURL);
      setSearchQuery(queryFromURL);
      fetchSearchResults(queryFromURL);
    }
  }, [location.search]);

  const fetchSearchResults = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchIssues({ keyword: query });
      if (response.isSuccess) {
        setSearchResults(response.result.content);
      }
    } catch (error) {
      console.error('검색 결과를 가져오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/search?query=${inputValue.trim()}`);
    }
  };

  const lowerQuery = searchQuery.toLowerCase();

  const filteredActivities = dummyActivities.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );

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

  return (
    <Wrapper>
      <MainNav />
      <Content>
        <SearchHeader>
            <SearchBar
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSearch={handleSearch}
              placeholder="검색어를 입력해주세요."
              inputRef={inputRef}
            />
        </SearchHeader>

        {searchQuery && (
          <>
            <ResultTitle>'{searchQuery}'의 검색 결과</ResultTitle>

            {loading ? (
              <LoadingMessage>검색 중...</LoadingMessage>
            ) : searchResults.length === 0 && filteredActivities.length === 0 ? (
              <NoResult>검색 결과가 없습니다.</NoResult>
            ) : (
              <>
                {searchResults.length > 0 && (
                  <Section>
                    <SectionHeader>
                      <h3>글로벌 이슈</h3>
                      <MoreBtn onClick={() => navigate(`/more/global?query=${searchQuery}`)}>
                        더보기 &gt;
                      </MoreBtn>
                    </SectionHeader>
                    <CardGrid>
                      {searchResults.slice(0, 4).map((issue) => (
                        <IssueCard
                          key={issue.id}
                          id={issue.id}
                          title={issue.title}
                          tag={issue.categoryKr || issue.category || issue.keyword || '카테고리 없음'}
                          image={issue.thumbnailUrl || issue.image || ''}
                          bookmarked={issue.bookmarked}
                          onToggle={() => toggleGlobalBookmark(issue.id)}
                          onClick={() => navigate(`/global-issue/${issue.id}`, {
                            state: { label: issue.categoryKr || issue.category, title: issue.title }
                          })}
                        />
                      ))}
                    </CardGrid>
                  </Section>
                )}

                {filteredActivities.length > 0 && (
                  <Section>
                    <SectionHeader>
                      <h3>활동</h3>
                      <MoreBtn onClick={() => navigate(`/more/activity?query=${searchQuery}`)}>
                        더보기 &gt;
                      </MoreBtn>
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
  margin-bottom: 42px;
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
  margin-bottom: 15px;
  margin-left: -80px;

  h3 {
    font-size: 20px;
    align-self: flex-start;
    margin-left: -43px;
    color: rgb(95, 95, 95);
  }
`;

const MoreBtn = styled.span`
  font-size: 14px;
  color: #111;
  cursor: pointer;
  margin-right: -95px;
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

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 40px;
`;
