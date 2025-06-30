import React from "react";
import Feed from "./Feed";
import { useComments } from "../../hooks/queries/useComments";

interface CommentFeedProps {
  postId: string;
}
const CommentFeed = ({ postId }: CommentFeedProps) => {
  const {
    data: posts = [],
    isLoading: loading,
    isError,
  } = useComments(postId);

  if (isError) return <div>Error loading comments</div>
  return (
    <>
      <Feed posts={posts} loading={loading} />
    </>
  );
};
export default CommentFeed;
