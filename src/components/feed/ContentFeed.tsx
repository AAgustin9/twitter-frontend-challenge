import React from "react";
import Feed from "./Feed";
import { useFeed } from "../../hooks/queries/useFeed";
import { useAppSelector } from "../../redux/hooks";

const ContentFeed = () => {
  const query = useAppSelector((s) => s.user.query)
  const { data: posts = [], isLoading, isError } = useFeed(query)

  if (isError) return <div>Oops, could not load feed.</div>
  return <Feed posts={posts} loading={isLoading} />;
};
export default ContentFeed;
