import React from "react";
import { ItemRow, TableCell } from "./board.styles";

export default function FreePostItem({ index, post }) {
  return (
    <ItemRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{post.post_title}</TableCell>
      <TableCell>{post.authorName}</TableCell>
      <TableCell>{post.created_at.slice(0, 10)}</TableCell>
      <TableCell>{post.post_like_count}</TableCell>
    </ItemRow>
  );
}
