import { useParams } from "react-router-dom"
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../../components/toast/ToastProvider";
import { useEffect, useRef, useState } from "react";
import { MessageDTO } from "../../service";
import { ToastType } from "../../components/toast/Toast";
import styled from "styled-components";
import { BackArrowIcon } from "../../components/icon/Icon";
import { useNavigate } from "react-router-dom";

const Page = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
`;
const Header = styled.div`
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid ${(p) => p.theme.colors.containerLine};
`;
const Title = styled.h3`
    margin: 0 auto;
    font-size: 1rem;
`;
const Messages = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: ${(p) => p.theme.colors.inactiveBackground};
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
const Bubble = styled.div<{ mine: boolean }>`
    align-self: ${({ mine }) => (mine ? "flex-end" : "flex-start")};
    background: ${({ mine, theme }) =>
    mine ? theme.colors.main : theme.colors.white};
    color: ${({ mine, theme }) => (mine ? theme.colors.white : theme.colors.text)};
    padding: 8px 12px;
    border-radius: 16px;
    max-width: 70%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;
const InputBar = styled.form`
    display: flex;
    padding: 12px;
    border-top: 1px solid ${(p) => p.theme.colors.containerLine};
`;
const TextInput = styled.input`
    flex: 1;
    padding: 8px;
    border: 1px solid ${(p) => p.theme.colors.outline};
    border-radius: 4px 0 0 4px;
    &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.main};
    }
`;
const SendButton = styled.button`
    padding: 0 16px;
    border: none;
    background: ${(p) => p.theme.colors.main};
    color: white;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    &:disabled {
    background: ${(p) => p.theme.colors.hover};
    cursor: not-allowed;
    }
`;

const ChatPage = () => {
    const { id: receiverId } = useParams<{ id: string}>();
    const socket = useSocket();
    const showToast = useToast();
    const [messages, setMessages] = useState<MessageDTO[]>([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!receiverId) return;

        socket.startChat(receiverId);
        socket.onHistory((history) => {
            setMessages(history);
            showToast(ToastType.SUCCESS, "Chat connected");
        });
        socket.onNewMessage((msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        socket.onError((e) => showToast(ToastType.ALERT, e.message));
        
        return () => socket.disconnect();
    }, [receiverId, socket, showToast]);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (input.trim() && receiverId) {
            socket.send_message(receiverId, input.trim());
            setInput("");
        }
    };

    return (
        <Page>
          <Header>
            <BackArrowIcon
              onClick={() => navigate(-1)}
            />
            <Title>Chat with {receiverId}</Title>
          </Header>

          <Messages>
            {messages.map((m) => (
              <Bubble
                key={m.id}
                mine={m.senderId !== receiverId}
              >
                {m.content}
              </Bubble>
            ))}
            <div ref={bottomRef} />
          </Messages>
 
          <InputBar onSubmit={handleSend}>
            <TextInput
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <SendButton type="submit" disabled={!input.trim()}>
              Send
            </SendButton>
          </InputBar>
        </Page>
    );
};
 
export default ChatPage;