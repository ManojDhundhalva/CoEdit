import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import EmojiPicker, { Theme } from 'emoji-picker-react';

//Hooks
import useAPI from '../hooks/api';

//Utils
import { getAvatar } from '../utils/avatar';
import { formatLogTimestamp } from "../utils/formatters";

//Material Components
import { Box, Avatar, CircularProgress, Typography } from '@mui/material';

//Material Icons
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

function Chat(props) {

    const { socket, projectId } = props;
    const { GET } = useAPI();

    const [isEmojiOn, setIsEmojiOn] = useState(false);
    const [message, setMessage] = useState('');
    const [showScrollUp, setShowScrollUp] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(true);
    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);

    const [isChatLoading, setIsChatLoading] = useState(false);
    const [msgSendLoading, setMsgSendLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const toggleEmoji = () => setIsEmojiOn((prev) => !prev);

    // Function to scroll to top
    const scrollToTop = () => {
        chatContainerRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // Function to scroll to bottom
    const scrollToBottom = () => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    // Function to handle scroll event
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

        // Show or hide the scroll icons based on the current scroll position
        setShowScrollUp(scrollTop > 0);
        setShowScrollDown(scrollTop + clientHeight < scrollHeight);
    };

    // Attach scroll event listener
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
        }
        // Cleanup listener on component unmount
        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // Focus on the input field when the component renders
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    useEffect(() => {

        const loadMessages = async () => {
            setIsChatLoading(true);
            try {
                const response = await GET('/project/chat/messages', { project_id: projectId });
                setMessages(response.data);
                scrollToBottom();
            } catch (error) {
                toast(error.response?.data?.message || "Failed to load messages",
                    {
                        icon: <CancelRoundedIcon />,
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            } finally {
                setIsChatLoading(false);
            }
        }

        loadMessages();

    }, []);


    const handleSubmit = () => {
        if (!socket || message.trim() === '') return;

        setMsgSendLoading(true);
        const msgTime = formatLogTimestamp(new Date());

        socket.emit('chat:send-message', { message, time: msgTime });
        setMessage('');
    }

    useEffect(() => {
        if (!socket) return;

        const handleMessages = (data) => {
            const { socketId, ...other } = data;

            if (socketId === socket.id) { setMsgSendLoading(false); }

            setMessages((prevMessages) => [...prevMessages, other])
        }

        socket.on('chat:receive-message', handleMessages);

        return () => {
            socket.off('chat:receive-message', handleMessages);
        }
    }, [socket]);


    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Messages Section */}
            <Box
                id="style-1"
                ref={chatContainerRef}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                    minHeight: "24vh"
                }}
            >
                {isChatLoading ? (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                            <CircularProgress
                                size={20}
                                thickness={6}
                                sx={{
                                    color: "black",
                                    '& circle': { strokeLinecap: 'round' },
                                }}
                            />
                        </Box>
                    </>
                ) : (
                    messages.map((msg, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: "flex-start", gap: 1, bgcolor: "#E6E6E6", borderRadius: "10px", my: "10px" }}>
                            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", mx: 1, my: 2 }}>
                                <Avatar
                                    sx={{ width: 38, height: 38, fontSize: 16, border: "1px solid black" }}
                                    alt={msg.username}
                                    src={getAvatar(msg.image)}
                                    imgProps={{
                                        crossOrigin: "anonymous",
                                        referrerPolicy: "no-referrer",
                                        decoding: "async",
                                    }}
                                />
                            </Box>
                            <Box sx={{ py: 1, width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column" }}>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: "#404040" }}>{msg.username}</Typography>
                                <Typography sx={{ fontWeight: 'bold', color: 'black' }}>{msg.message}</Typography>
                                <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", px: 1 }}>
                                    <Typography variant="caption" fontWeight="bold" sx={{ color: "grey" }}>{msg.time}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            {/* Scroll to Top Button */}
            {showScrollUp && (
                <Box sx={{ position: 'absolute', top: 2, right: 14 }}>
                    <KeyboardDoubleArrowUpRoundedIcon
                        onClick={scrollToTop}
                        sx={{
                            p: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: 'black',
                            borderRadius: '20px',
                            bgcolor: '#E6E6E6',
                            '&:hover': { bgcolor: '#CCCCCC' },
                        }}
                    />
                </Box>
            )}

            {/* Scroll to Bottom Button */}
            {showScrollDown && (
                <Box sx={{ position: 'absolute', bottom: 62, right: 14 }}>
                    <KeyboardDoubleArrowDownRoundedIcon
                        onClick={scrollToBottom}
                        sx={{
                            p: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: 'black',
                            borderRadius: '20px',
                            bgcolor: '#E6E6E6',
                            '&:hover': { bgcolor: '#CCCCCC' },
                        }}
                    />
                </Box>
            )}

            {/* Input Section */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    borderTop: '1px solid #D9D9D9',
                    p: 1,
                    gap: 1,
                }}
            >
                <button
                    style={{ cursor: 'pointer', paddingLeft: 6, paddingRight: 6 }}
                    onClick={toggleEmoji}
                >
                    <SentimentSatisfiedRoundedIcon />
                </button>
                <textarea
                    id='style-1'
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    rows={message.includes('\n') ? 2 : 1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (e.shiftKey) {
                                e.preventDefault(); // Prevents default newline behavior.
                                setMessage((prevMsg) => prevMsg + '\n');
                            } else {
                                e.preventDefault(); // Prevents textarea from adding a new line.
                                handleSubmit(); // Send the message.
                            }
                        }
                    }}
                    style={{
                        flexGrow: 2,
                        backgroundColor: 'transparent',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        padding: '5px',
                        outline: 'none',
                        fontWeight: 'bold',
                        resize: 'none', // Disable resizing to maintain max rows
                        overflowY: 'auto', // Add scroll when max rows are reached
                    }}
                />
                <button
                    onClick={handleSubmit}
                    style={{
                        backgroundColor: '#333333',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px',
                    }}
                >

                    {msgSendLoading ?
                        <CircularProgress
                            size={20}
                            thickness={6}
                            sx={{
                                color: "white",
                                '& circle': { strokeLinecap: 'round' },
                            }}
                        />
                        :
                        <SendRoundedIcon sx={{ color: 'white' }} />}
                </button>
            </Box>

            {/* Emoji Picker */}
            {isEmojiOn && (
                <Box sx={{ zIndex: 999999999 }}>
                    <EmojiPicker
                        onEmojiClick={(emojiData) =>
                            setMessage((prevMsg) => prevMsg + emojiData.emoji)
                        }
                        emojiStyle="facebook"
                        theme={Theme.DARK}
                        style={{
                            display: 'flex',
                            width: '100%',
                            zIndex: 999999999,
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default Chat;
