import React from "react";
import { Post } from "../../service";
import { StyledContainer } from "../common/Container";
import Tweet from "../tweet/Tweet";
import Loader from "../loader/Loader";

interface FeedProps {
  posts: Post[];
  loading: boolean;
}

const Feed = ({ posts, loading }: FeedProps) => {
  const safePosts = posts ?? [];
  return (
    <StyledContainer width={"100%"} alignItems={"center"}>
      {safePosts
        .filter((post, index, self) => {
          return self.findIndex((p) => p.id === post.id) === index;
        })
        .map((post: Post) => (
          <Tweet key={post.id} post={post} />
        ))}
      {loading && <Loader />}
    </StyledContainer>
  );
};

export default Feed;
