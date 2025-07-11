import styled from "styled-components";

export const StyledFeedContainer = styled.div.attrs({ id: "feed-container" })`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  scrollbar-width: none;
  flex: 1;
  overflow-y: auto;

  @media (max-width: 600px) {
    margin-bottom: 48px;
  }
`;
