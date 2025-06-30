import { useGetFollowing } from "../../hooks/queries/useFollowing"
import { StyledSuggestionBoxContainer } from "../home-page/components/suggestionBox/SuggestionBoxContainer"
import ChatUserBox from "../../components/chat-user/ChatUserBox"

const MessagesPage = () => {
    const { data: following = [], isLoading, isError } = useGetFollowing()
  
    if (isLoading) return <div>Loading…</div>
    if (isError) return <div>Failed to load</div>
  
    return (
        <StyledSuggestionBoxContainer>
        <h6>{("All Messages")}</h6>
        {(
          following
            .filter((value, index, array) => {
              return array.indexOf(value) === index;
            })
            .slice(0, 5)
            .map((user) => (
              <ChatUserBox
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                profilePicture={user.profilePicture}
              />
            ))
        )}
      </StyledSuggestionBoxContainer>
    )
};
  
export default MessagesPage