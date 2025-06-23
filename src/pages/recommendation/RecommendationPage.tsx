import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyledContainer,
  StyledScrollableContainer,
} from "../../components/common/Container";
import FollowUserBox from "../../components/follow-user/FollowUserBox";
import { StyledH5 } from "../../components/common/text";
import { useRecommendations } from "../../hooks/queries/useRecommendations";

const RecommendationPage = () => {
  const [page, setPage] = useState(0);
  const {
    data: users = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useRecommendations(page);
  const { t } = useTranslation();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastRecommendation = useCallback(
    (node: Element | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 10);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, setPage]
  );

  return (
    <StyledContainer maxWidth={"600px"} borderRight={"1px solid"}>
      <StyledContainer padding={"16px"} maxHeight={"53px"}>
        <StyledH5>{t("header.connect")}</StyledH5>
      </StyledContainer>
      <StyledScrollableContainer padding={"8px"} gap={"16px"}>
        {loading && <p>Loading recommendations…</p>}
        {isError && (
          <div>
            <p>Error loading recommendations: {String(error)}</p>
            <button onClick={() => void refetch()}>Retry</button>
          </div>
        )}
        {!loading && !isError && users.map((user) => (
          <FollowUserBox
            key={`recommendation-${user.id}`}
            name={user.name}
            username={user.username}
            profilePicture={user.profilePicture}
            id={user.id}
          />
        ))}
      </StyledScrollableContainer>
    </StyledContainer>
  );
};

export default RecommendationPage;
