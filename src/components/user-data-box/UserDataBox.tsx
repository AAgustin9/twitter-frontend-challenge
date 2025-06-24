import React from "react";
import Avatar from "../common/avatar/Avatar";
import icon from "../../assets/icon.jpg";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const UserDataBoxContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: stretch;
  height: 100%;
  min-height: 48px;
  gap: 4px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  box-sizing: border-box;
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  width: 100%;
  padding-left: 8px;
  padding-top: 8px;
`

const NameContainer = styled.div`
  font-family: "Manrope", sans-serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 110%;
  letter-spacing: -0.15px;
  margin: 0;
`
const NameContainerColor = styled(NameContainer)`
  color: #566370;
`

interface UserDataBoxProps {
  name?: string;
  username?: string;
  profilePicture?: string;
  id: string;
  onClick?: () => void;
}
export const UserDataBox = ({
  name,
  username,
  profilePicture,
  id,
  onClick,
}: UserDataBoxProps) => {
  const navigate = useNavigate();

  return (
    <UserDataBoxContainer onClick={onClick}>
      <Avatar
        width={"48px"}
        height={"48px"}
        src={profilePicture ?? icon}
        onClick={() => onClick ?? navigate(`/profile/${id}`)}
        alt={name ?? "Name"}
      />
      <UserInfoContainer>
        <NameContainer>{name ?? "Name"}</NameContainer>
        <NameContainerColor>{"@" + username ?? "@Username"}</NameContainerColor>
      </UserInfoContainer>
    </UserDataBoxContainer>
  );
};

export default UserDataBox;
