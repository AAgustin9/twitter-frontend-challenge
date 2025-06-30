import styled, { StyledComponent } from "styled-components";

export const StyledTweetBoxContainer: StyledComponent<"div", any> = styled.div`  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  button {
    display: flex;
  }
`;
