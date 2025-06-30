import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import {useHttpRequestService} from "../../service/HttpRequestService";
import UserDataBox from "../user-data-box/UserDataBox";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import {Author, User} from "../../service";
import { useMe } from "../../hooks/queries/useMe";
import styled from "styled-components";
import { useToast } from "../toast/ToastProvider";
import { ToastType } from "../toast/Toast";

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
  isInitiallyFollowing?: boolean;
}

const FollowUserBox = ({
  profilePicture,
  name,
  username,
  id,
  isInitiallyFollowing = false,
}: FollowUserBoxProps) => {
  const {t} = useTranslation();
  const service = useHttpRequestService()
  const { data: me, isLoading } = useMe();
  const showToast = useToast();

  // useEffect(() => {
  //   if (me) {
  //     setIsFollowing(me.following?.some((f: Author) => f.id === id) ?? false);
  //   }
  // }, [me, id]);

  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await service.unfollowUser(id);
        setIsFollowing(false);
      } else {
        await service.followUser(id);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
      showToast(ToastType.ALERT, "You already follow this user");
    }
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
