import React from "react";
import styled from "styled-components";
import heartIcon from "../../../assets/images/board/ic_heart.png";
import { useNavigate } from "react-router-dom";

export default function FreePostList({ posts, currentPage, itemsPerPage }) {
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/board/detail/${postId}`);
  };

  return (
    <Table>
      <thead>
        <tr>
          <TableHead>No.</TableHead>
          <TableHead>제목</TableHead>
          <TableHead>작성자</TableHead>
          <TableHead>날짜</TableHead>
          <TableHead>
            <IconImage src={heartIcon} alt="좋아요" />
          </TableHead>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, idx) => (
          <PostRow
            key={post.post_id}
            isEven={idx % 2 === 1}
            isLastRow={idx === posts.length - 1}
            onClick={() => handlePostClick(post.post_id)}
            style={{ cursor: 'pointer' }}
          >
            <TableData>{(currentPage - 1) * itemsPerPage + idx + 1}</TableData>
            <TableData>{post.post_title}</TableData>
            <TableData>{post.authorName}</TableData>
            <TableData>{post.created_at.slice(0, 10)}</TableData>
            <TableData>{post.post_like_count}</TableData>
          </PostRow>
        ))}
      </tbody>
    </Table>
  );
}

// 스타일 컴포넌트
const Table = styled.table`
  width: 97%;
  margin-top: 24px;
  border-collapse: collapse;
  margin-left: 20px;
`;

const TableHead = styled.th`
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  background-color: #F6FAFF;
  border-top: 2px solid #1C4987;
  border-bottom: 2px solid #1C4987;
`;

const TableData = styled.td`
  padding: 18px;
  font-size: 16px;
  text-align: center;
`;

const PostRow = styled.tr`
  background-color: ${(props) => (props.isEven ? "#F6FAFF" : "#ffffff")};
  border-bottom: ${(props) =>
    props.isLastRow ? "2px solid #1C4987" : "1px solid #235BA9"};
  }
`;

const IconImage = styled.img`
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
`;
