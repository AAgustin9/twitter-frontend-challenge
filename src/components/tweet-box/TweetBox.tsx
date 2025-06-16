import React, {
    useEffect,
    useState,
    ChangeEvent,
  } from "react";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import {useHttpRequestService} from "../../service/HttpRequestService";
import {setLength, updateFeed} from "../../redux/user";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import {BackArrowIcon} from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import {StyledTweetBoxContainer} from "./TweetBoxContainer";
import {StyledContainer} from "../common/Container";
import {StyledButtonContainer} from "./ButtonContainer";
import { User } from "../../service";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";

interface TweetBoxProps {
    parentId?: string;
    close?: () => void;
    mobile?: boolean;
    borderless?: boolean,
}

const TweetBox: React.FC<TweetBoxProps> = ({
    parentId,
    close,
    mobile,
    borderless,
}) => {
    const [content, setContent] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);
    const [user, setUser] = useState<User | undefined>(undefined);

    const {feed, length, query} = useAppSelector((state: RootState) => state.user);
    const httpService = useHttpRequestService();
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const service = useHttpRequestService();

    useEffect(() => {
        handleGetUser().then(r => setUser(r))
    }, []);

    const handleGetUser = async (): Promise<User> => {
        return await service.me();
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setContent(e.target.value);
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            const newPost = await httpService.createPost({
                content,
                parentId,
                images
            });
            
            const currentUser = await handleGetUser();
            const extendedPost = {
                ...newPost,
                author: currentUser,
                reactions: [],
                comments: []
            };

            dispatch(updateFeed([extendedPost, ...feed]));
            dispatch(setLength(feed.length + 1));
            
            setContent("");
            setImages([]);
            setImagesPreview([]);
            close && close();
        } catch (e) {
            console.log(e);
        }
    };

    const handleRemoveImage = (index: number): void => {
        const newImages = images.filter((i, idx) => idx !== index);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImages(newImages);
        setImagesPreview(newImagesPreview);
    };

    const handleAddImage = (newImages: File[]): void => {
        setImages(newImages);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImagesPreview(newImagesPreview);
    };

    return (
        <StyledTweetBoxContainer>
            {mobile && (
                <StyledContainer
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <BackArrowIcon onClick={close}/>
                    <Button
                        text={"Tweet"}
                        buttonType={ButtonType.DEFAULT}
                        size={"SMALL"}
                        onClick={handleSubmit}
                        disabled={content.length === 0}
                    />
                </StyledContainer>
            )}
            <StyledContainer style={{width: "100%"}}>
                <TweetInput
                    onChange={handleChange}
                    maxLength={240}
                    placeholder={t("placeholder.tweet")}
                    value={content}
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
                    <ImageInput setImages={handleAddImage} parentId={parentId}/>
                    {!mobile && (
                        <Button
                            text={"Tweet"}
                            buttonType={ButtonType.DEFAULT}
                            size={"SMALL"}
                            onClick={handleSubmit}
                            disabled={
                                content.length <= 0 ||
                                content.length > 240 ||
                                images.length > 4 ||
                                images.length < 0
                            }
                        />
                    )}
                </StyledButtonContainer>
            </StyledContainer>
        </StyledTweetBoxContainer>
    );
};

export default TweetBox;
