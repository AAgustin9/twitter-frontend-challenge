import styled from "styled-components";

export const StyledSearchResultModalContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);   // sit just below the input
  left: 0;
  z-index: 100;            // make sure it floats above other panels
  display: flex;
  width: 100%;
  max-width: inherit;
  padding: 8px;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  gap: 16px;
  border-radius: 16px;
  background: ${(props) => props.theme.background};
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.25);
  transition: 0.3s ease-in-out;
`;

// interface SearchResultModalContainerProps {
//     short?: boolean;
// }
