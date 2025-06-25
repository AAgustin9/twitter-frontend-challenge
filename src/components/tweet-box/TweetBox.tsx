import React from "react";
import {
  useFormik,
} from "formik";
import * as Yup from "yup";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import { useHttpRequestService } from "../../service/HttpRequestService";
import { setLength, updateFeed } from "../../redux/user";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import { BackArrowIcon } from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import { useTranslation } from "react-i18next";
import { ButtonType } from "../button/StyledButton";
import { StyledTweetBoxContainer } from "./TweetBoxContainer";
import { StyledContainer } from "../common/Container";
import { StyledButtonContainer } from "./ButtonContainer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { S3Service } from "../../service/S3Service";
import { useMe } from "../../hooks/queries/useMe";
import { ToastType } from "../toast/Toast";
import { useToast } from "../toast/ToastProvider";

interface TweetBoxProps {
  parentId?: string;
  close?: () => void;
  mobile?: boolean;
  borderless?: boolean;
}

interface TweetFormValues {
  content: string;
  images: File[];
}

const TweetBox: React.FC<TweetBoxProps> = ({
  parentId,
  close,
  mobile,
  borderless,
}) => {
  const { data: user } = useMe();
  const { feed } = useAppSelector((state: RootState) => state.user);
  const httpService = useHttpRequestService();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const showToast = useToast();

  const [imagesPreview, setImagesPreview] = React.useState<string[]>([]);

  const formik = useFormik<TweetFormValues>({
    initialValues: {
      content: "",
      images: [],
    },
    validationSchema: Yup.object({
      content: Yup.string()
        .max(240, t("error.maxLength", { max: 240 }))
        .required(t("error.required")),
      images: Yup.array()
        .max(4, t("error.maxImages", { max: 4 })),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const keys: string[] = [];
        const imageUrls: string[] = [];

        for (const file of values.images) {
          const { uploadUrl, imageUrl, key } =
            await httpService.getPostImageUploadUrl(file.type);
          await S3Service.upload(file, uploadUrl);
          keys.push(key);
          imageUrls.push(imageUrl);
        }

        const newPost = await httpService.createPost({
          content: values.content,
          parentId,
          images: keys,
        });

        const extendedPost = {
          ...newPost,
          images: imageUrls,
          author: user!,
          reactions: [],
          comments: [],
        };

        dispatch(updateFeed([extendedPost, ...feed]));
        dispatch(setLength(feed.length + 1));

        showToast(ToastType.SUCCESS, "Tweet posted successfully");

        resetForm();
        setImagesPreview([]);
        close && close();
      } catch (e: any) {
        showToast(ToastType.ALERT, e.message || "Failed to post tweet");
        console.log(e);
      }
    },
  });

  const handleAddImage = (newImages: File[]) => {
    formik.setFieldValue("images", newImages);
    setImagesPreview(newImages.map((i) => URL.createObjectURL(i)));
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formik.values.images.filter((_, idx) => idx !== index);
    formik.setFieldValue("images", newImages);
    setImagesPreview(newImages.map((i) => URL.createObjectURL(i)));
  };

  return (
    <StyledTweetBoxContainer>
      {mobile && (
        <StyledContainer
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <BackArrowIcon onClick={close} />
          <Button
            text={"Tweet"}
            buttonType={ButtonType.DEFAULT}
            size={"SMALL"}
            onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            disabled={
              !formik.values.content ||
              formik.values.content.length > 240 ||
              formik.values.images.length > 4
            }
          />
        </StyledContainer>
      )}
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <StyledContainer style={{ width: "100%" }}>
          <TweetInput
            onChange={formik.handleChange}
            maxLength={240}
            placeholder={t("placeholder.tweet")}
            value={formik.values.content}
            name="content"
            src={user?.profilePicture}
          />
          <StyledContainer padding={"0 0 0 10%"}>
            <ImageContainer
              editable
              images={imagesPreview}
              removeFunction={handleRemoveImage}
            />
          </StyledContainer>
          <StyledButtonContainer>
            <ImageInput
              setImages={handleAddImage}
              parentId={parentId}
            />
            {!mobile && (
              <Button
                text={"Tweet"}
                buttonType={ButtonType.DEFAULT}
                size={"SMALL"}
                onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                disabled={
                  formik.values.content.length === 0 ||
                  formik.values.content.length > 240 ||
                  formik.values.images.length > 4
                }
              />
            )}
          </StyledButtonContainer>
        </StyledContainer>
      </form>
    </StyledTweetBoxContainer>
  );
};

export default TweetBox;
