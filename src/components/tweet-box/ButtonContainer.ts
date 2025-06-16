import styled, { StyledComponent } from "styled-components";

export const StyledButtonContainer: StyledComponent<"div", any> = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-top: 4px;
  gap: 8px;

  button {
    margin: 0;
  }
`;
