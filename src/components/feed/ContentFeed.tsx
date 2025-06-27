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
      const container = document.getElementById("feed-container");
      if (!container) return;
  
      const onScroll = () => {
        const threshold = 100;
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;
  
        if (distanceFromBottom < threshold && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      };
  
      container.addEventListener("scroll", onScroll);
      return () => {
        container.removeEventListener("scroll", onScroll);
      };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) return <div>Oops, could not load feed.</div>
  return <Feed posts={allPosts} loading={isLoading || isFetchingNextPage} />;
};
export default ContentFeed;
