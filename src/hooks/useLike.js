import { useState } from "react";

export default function useLike(initialCount = 0) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const toggleLike = () => {
    setLiked((prevLiked) => {
      setCount((prevCount) => prevLiked ? prevCount - 1 : prevCount + 1);
      return !prevLiked;
    });
  };

  return { liked, count, toggleLike };
}
