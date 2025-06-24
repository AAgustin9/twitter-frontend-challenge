import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import {useHttpRequestService} from "../../service/HttpRequestService";
import UserDataBox from "../user-data-box/UserDataBox";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import {Author, User} from "../../service";
import { useMe } from "../../hooks/queries/useMe";
import styled from "styled-components";

const FollowUserBoxContainer = styled.div`
  display: flex;
  justily-content: space-between;
  align-items: stretch;
  max-height: 60px;
  gap: 8px;
`;

interface FollowUserBoxProps {
  profilePicture?: string;
  name?: string;
  username?: string;
  id: string;
}

const FollowUserBox = ({
  profilePicture,
  name,
  username,
  id,
}: FollowUserBoxProps) => {
  const {t} = useTranslation();
  const service = useHttpRequestService()
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (me) {
      setIsFollowing(me.following?.some((f: Author) => f.id === id) ?? false);
    }
  }, [me, id]);

  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    if (isFollowing) {
      await service.unfollowUser(id);
    } else {
      await service.followUser(id);
    }
    setIsFollowing(!isFollowing);
  };

  return (
      <FollowUserBoxContainer>
        <UserDataBox
            id={id}
            name={name!}
            profilePicture={profilePicture!}
            username={username!}
        />
        <Button
            text={isFollowing ? t("buttons.unfollow") : t("buttons.follow")}
            buttonType={isFollowing ? ButtonType.DELETE : ButtonType.FOLLOW}
            size={"SMALL"}
            onClick={handleFollow}
        />
      </FollowUserBoxContainer>
  );
};

export default FollowUserBox;
