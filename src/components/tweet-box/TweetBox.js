import React, {useEffect, useState} from "react";
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
import {useDispatch, useSelector} from "react-redux";
import {User} from "../../service";

const TweetBox = (props) => {
    const {parentId, close, mobile} = props;
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const {feed, length, query} = useSelector((state) => state.user);
    const httpService = useHttpRequestService();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const service = useHttpRequestService()
    const [user, setUser] = useState()




    useEffect(() => {
        handleGetUser().then(r => setUser(r))
    }, []);

    const handleGetUser = async () => {
        return await service.me()
    }

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = async () => {
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

    const handleRemoveImage = (index) => {
        const newImages = images.filter((i, idx) => idx !== index);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImages(newImages);
        setImagesPreview(newImagesPreview);
    };

    const handleAddImage = (newImages) => {
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
