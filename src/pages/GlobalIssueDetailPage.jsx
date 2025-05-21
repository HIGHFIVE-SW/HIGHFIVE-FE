import {React,useState} from 'react';
import styled from 'styled-components';
import { useLocation,useNavigate } from 'react-router-dom';
import MainNav from '../layout/MainNav';
import Footer from '../layout/Footer';
import ActivityCard from '../components/activity/ActivityCard';
import sampleImage from '../assets/images/main/ic_IssueCardSample.png';
import linkIcon from '../assets/images/ic_Link.png';
import BookmarkButtonIcon from '../assets/images/main/BookmarkButton.png';
import BookmarkFilledIcon from '../assets/images/main/BookmarkFilledButton.png';

const dummyActivities = [
  {
    id: 1,
    title: '제 22회 한국 경제 논문 공모전',
    tags: ['#경제', '#공모전'],
    date: '2025.04.15~2025.04.20',
    image: require('../assets/images/activity/ic_ActivityImage.png'),
    bookmarked: false,
  },
  {
    id: 2,
    title: '경제 공모전',
    tags: ['#경제', '#공모전'],
    date: '2025.04.15~2025.04.20',
    image: require('../assets/images/activity/ic_ActivityImage.png'),
    bookmarked: false,
  },
  {
    id: 3,
    title: '경제 봉사활동',
    tags: ['#경제', '#봉사활동'],
    date: '2025.04.15~2025.04.20',
    image: require('../assets/images/activity/ic_ActivityImage.png'),
    bookmarked: false,
  },
  {
    id: 4,
    title: '경제 서포터즈',
    tags: ['#경제', '#서포터즈'],
    date: '2025.04.15~2025.04.20',
    image: require('../assets/images/activity/ic_ActivityImage.png'),
    bookmarked: false,
  },
  {
    id: 5,
    title: '환경 서포터즈',
    tags: ['#환경', '#서포터즈'],
    date: '2025.04.15~2025.04.20',
    image: require('../assets/images/activity/ic_ActivityImage.png'),
    bookmarked: false,
  },
  {
    id: 6,
    title: '사람과 사회 서포터즈',
    tags: ['#사람과 사회', '#서포터즈'],
    date: '2025.04.15~2025.04.20',
    image: require('../assets/images/activity/ic_ActivityImage.png'),
    bookmarked: false,
  },
];


export default function GlobalIssueDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { label, title } = location.state || {};

  const [bookmarked, setBookmarked] = useState(false);
  const toggleBookmark = () => setBookmarked((prev) => !prev);

  const filteredActivities = dummyActivities.filter((activity) =>
    activity.tags.includes(label) );

  return (
    <PageWrapper>
      <MainNav />
      <ContentWrapper>
      <HeaderWrapper>
        <div>
            <LabelWrapper>
            <Label>{label?.replace('#', '')}</Label>
            </LabelWrapper>
            <Title>{title}</Title>
            <Date>2025.04.07</Date>
        </div>
        <BookmarkIcon
            src={bookmarked ? BookmarkFilledIcon : BookmarkButtonIcon}
            alt="북마크"
            onClick={toggleBookmark}
        />
        </HeaderWrapper>
        
        <Divider />
        <MainImage src={sampleImage} alt="이슈 이미지" />
        <SummarySection>
          <SummaryTitle>내용 요약</SummaryTitle>
          <SummaryText>
            7일 국내 증시는 윤석열 전 대통령 파면 결정으로 정치적 불확실성이 해소됐음에도 불구하고,
            미국의 전 세계 수입품에 대한 관세 부과로 촉발된 글로벌 관세 전쟁 우려로 인해 코스피와
            코스닥이 5% 넘게 급락했다. 미국 증시의 폭락 여파로 아시아 주요 증시도 큰 하락세를
            보였으며, 원·달러 환율 역시 급등했다. 전문가들은 정치 리스크 해소가 단발적으로는
            국내 증시에 긍정적 영향을 줄 수 있으나, 글로벌 경제 불확실성에 따른 변동성에
            당분간 유의할 필요가 있다고 분석했다.
          </SummaryText>
        </SummarySection>
        <SummarySection>
          <OriginalLink href="#">
            <LinkImage src={linkIcon} alt="링크 아이콘" />
            관심이 있다면 원본 기사 확인하기
          </OriginalLink>
        </SummarySection>
      </ContentWrapper>

      <RecommendWrapper>
        <Divider />
        <RecommendCardsHeader>
          <RecommendTitle>추천 활동</RecommendTitle>
          <MoreLink onClick={() => navigate(`/more-detail?query=${encodeURIComponent(label)}`)}>
            더보기 &gt;
        </MoreLink>

        </RecommendCardsHeader>
        <RecommendCards>
            {filteredActivities.map((activity) => (
                <CardWrapper key={activity.id}>
                <ActivityCard
                    title={activity.title}
                    tags={activity.tags}
                    date={activity.date}
                    image={activity.image}
                    bookmarked={activity.bookmarked}
                    onToggle={() => {}}
                />
                </CardWrapper>
        ))}
        </RecommendCards>

      </RecommendWrapper>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const RecommendWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
`;

const Label = styled.div`
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Date = styled.p`
  font-size: 17px;
  color: #888;
  margin-bottom: 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin-bottom: 30px;
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 30px;
`;

const SummarySection = styled.div`
  background-color: #f6faff;
  padding: 50px;
  border-radius: 10px;
  margin-bottom: 60px;
`;

const SummaryTitle = styled.h2`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
`;

const SummaryText = styled.p`
  font-size: 22px;
  color: #333;
  line-height: 2;
  margin-bottom: 12px;
  text-align: center;
`;

const OriginalLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #235BA9
  margin-top: 10px;
  cursor: pointer;
`;

const LinkImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 8px;
`;

const RecommendCardsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const RecommendTitle = styled.h3`
  font-size: 30px;
  font-weight: 700;
  margin-top: 0;
`;

const MoreLink = styled.a`
  font-size: 14px;
  color: #000;
  cursor: pointer;
  text-decoration: none;
  margin-bottom: -70px;

  &:hover {
    text-decoration: underline;
  }
`;

const RecommendCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 100%;
`;

const CardWrapper = styled.div`
  transform: scale(0.9);
  transform-origin: top left;
  width: fit-content;
  zoom: 0.9;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const BookmarkIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  cursor: pointer;
`;
