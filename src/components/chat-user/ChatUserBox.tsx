import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import {useHttpRequestService} from "../../service/HttpRequestService";
import UserDataBox from "../user-data-box/UserDataBox";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import {Author, User} from "../../service";
import { useMe } from "../../hooks/queries/useMe";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ChatUserBoxContainer = styled.div`
  display: flex;
  justily-content: space-between;
  align-items: stretch;
  max-height: 60px;
  gap: 8px;
`;

interface ChatUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
}

const ChatUserBox = ({
  profilePicture,
  name,
  username,
  id,
}: ChatUserBoxProps) => {
  const {t} = useTranslation();
  const service = useHttpRequestService()
  const { data: me, isLoading } = useMe();
  const navigate = useNavigate();

  
  const handleFollow = async () => {
    navigate(`/chat/${id}`)
  };

  return (
      <ChatUserBoxContainer>
        <UserDataBox
            id={id}
            name={name!}
            profilePicture={profilePicture!}
            username={username!}
        />
        <Button
            text={("Chat")}
            buttonType={ButtonType.DEFAULT}
            size={"SMALL"}
            onClick={handleFollow}
        />
      </ChatUserBoxContainer>
  );
};

export default ChatUserBox;
