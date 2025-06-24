import React, { ChangeEventHandler } from "react";
import Avatar from "../common/avatar/Avatar";
import Icon from "../../assets/icon.jpg";
import { StyledTweetInputContainer } from "./TweetInputContainer";
import { StyledBorderlessTextArea } from "./BorderlessTextArea";

interface TweetInputProps {
  placeholder: string;
  src?: string;
  alt?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  maxLength: number;
  value?: string;
  name?: string;
}
const TweetInput = ({
  placeholder,
  src,
  alt,
  onChange,
  maxLength,
  value,
  name,
}: TweetInputProps) => {
  return (
    <StyledTweetInputContainer>
      <Avatar src={src ?? Icon} alt={alt ?? "Icon"} />
      <StyledBorderlessTextArea
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value ?? ""}
        name={name}
      />
    </StyledTweetInputContainer>
  );
};
export default TweetInput;
