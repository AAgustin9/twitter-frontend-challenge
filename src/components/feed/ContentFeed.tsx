import React, { useEffect } from "react";
import Feed from "./Feed";
import { useInfiniteFeed } from "../../hooks/queries/useInfiniteFeed";
import { useAppSelector } from "../../redux/hooks";
import styled from "styled-components";
import { Icon, IconType } from "../icon/Icon";

const RefreshContainer = styled.div`
  width: 100%;
  text-align: left;
  padding: 16px;
`;

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.main};
  transition: background 0.2s, transform 0.1s;

  &:hover {
    background: ${props => props.theme.hover.default};
  }
  &:active {
    transform: scale(0.95);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContentFeed = () => {
  const query = useAppSelector((s) => s.user.query)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
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
  
  return (
    <>
      <RefreshContainer>
        <RefreshButton
          onClick={() => refetch()}
          disabled={isLoading}
          title="Refresh feed"
        >
          {Icon({ width: "20px", height: "20px" })[IconType.RETWEET]}
        </RefreshButton>
      </RefreshContainer>
      <Feed posts={allPosts} loading={isLoading || isFetchingNextPage} />
    </>
  );
};
export default ContentFeed;
