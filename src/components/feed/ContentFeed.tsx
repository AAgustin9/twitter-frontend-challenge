import React, { useEffect } from "react";
import Feed from "./Feed";
import { useInfiniteFeed } from "../../hooks/queries/useInfiniteFeed";
import { useAppSelector } from "../../redux/hooks";

const ContentFeed = () => {
  const query = useAppSelector((s) => s.user.query)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFeed(query);
    
  const allPosts = data?.pages.flat() ?? [];

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.screenY >= document.body.offsetHeight - 300;
      
      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) return <div>Oops, could not load feed.</div>
  return <Feed posts={allPosts} loading={isLoading || isFetchingNextPage} />;
};
export default ContentFeed;
