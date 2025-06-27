import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ProfileInfo from "./ProfileInfo";
import Modal from "../../components/modal/Modal";
import Button from "../../components/button/Button";
import ProfileFeed from "../../components/feed/ProfileFeed";
import { StyledContainer } from "../../components/common/Container";
import { StyledH5 } from "../../components/common/text";

import { ButtonType } from "../../components/button/StyledButton";
import { useHttpRequestService } from "../../service/HttpRequestService";
import { useProfile } from "../../hooks/queries/useProfile";
import { useMe } from "../../hooks/queries/useMe";
import { useProfileViewFallback } from "../../hooks/queries/useProfileViewFallback";
import { User } from "../../service";
import Loader from "../../components/loader/Loader";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const service = useHttpRequestService();

  const [showModal, setShowModal] = useState(false);
  const [modalValues, setModalValues] = useState({
    text: "",
    title: "",
    type: ButtonType.DEFAULT,
    buttonText: "",
  });

  const { data: user } = useMe();
  const {
    data: profile,
    isError: isProfileError,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useProfile(id!);
  const { data: fallbackProfile } = useProfileViewFallback(id!, isProfileError);

  const finalProfile = profile ?? fallbackProfile;

  
  const following = useMemo(() => {
    return finalProfile?.followers?.some((f: User) => f.id === user?.id) ?? false;
  }, [finalProfile, user]);  
  
  if (isProfileLoading) {
    return (
      <StyledContainer justifyContent="center" alignItems="center" height="100vh">
       <Loader />
     </StyledContainer>
    );
  }

  if (!id || !finalProfile) return null;
  const isOwner = finalProfile.id === user?.id

  const handleButtonType = (): { component: ButtonType; text: string } => {
    if (isOwner)
      return { component: ButtonType.DELETE, text: t("buttons.delete") };
    if (following)
      return { component: ButtonType.OUTLINED, text: t("buttons.unfollow") };
    return { component: ButtonType.FOLLOW, text: t("buttons.follow") };
  };

  const handleSubmit = async () => {
    if (isOwner) {
      await service.deleteProfile();
      localStorage.removeItem("token");
      navigate("/sign-in");
    } else {
      await service.unfollowUser(finalProfile.id);
      setShowModal(false);
      refetchProfile();
    }
  };

  const handleButtonAction = async () => {
    if (isOwner) {
      setModalValues({
        title: t("modal-title.delete-account"),
        text: t("modal-content.delete-account"),
        type: ButtonType.DELETE,
        buttonText: t("buttons.delete"),
      });
      setShowModal(true);
    } else if (following) {
      setModalValues({
        title: `${t("modal-title.unfollow")} @${finalProfile.username}?`,
        text: t("modal-content.unfollow"),
        type: ButtonType.FOLLOW,
        buttonText: t("buttons.unfollow"),
      });
      setShowModal(true);
    } else {
      await service.followUser(id);
      await refetchProfile();
    }
  };

  return (
    <StyledContainer
      maxHeight="100vh"
      borderRight="1px solid #ebeef0"
      maxWidth="600px"
    >
      <StyledContainer borderBottom="1px solid #ebeef0" maxHeight="212px" padding="16px">
        <StyledContainer alignItems="center" padding="24px 0 0 0" flexDirection="row">
          <ProfileInfo
            name={finalProfile.name!}
            username={finalProfile.username}
            profilePicture={finalProfile.profilePicture}
          />
          <Button
            buttonType={handleButtonType().component}
            size="100px"
            onClick={handleButtonAction}
            text={handleButtonType().text}
          />
        </StyledContainer>
      </StyledContainer>

      <StyledContainer 
      width="100%"
      flex={1}
      overflowY="auto"
      >
        {finalProfile.private && !finalProfile.isFollowing
          ? <StyledH5>Private account</StyledH5>
          : <ProfileFeed /> 
        }
      </StyledContainer>

      <Modal
        show={showModal}
        text={modalValues.text}
        title={modalValues.title}
        acceptButton={
          <Button
            buttonType={modalValues.type}
            text={modalValues.buttonText}
            size="MEDIUM"
            onClick={handleSubmit}
          />
        }
        onClose={() => setShowModal(false)}
      />
    </StyledContainer>
  );
};

export default ProfilePage;
