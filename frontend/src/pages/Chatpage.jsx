import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//import Spinner from '../components/Spinner';
import io from 'socket.io-client';
import typingg from '../components/typing.gif';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

function Chatpage() {
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const userId = user._id;

  const token = user.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [chats, setChats] = useState([]);
  const [text, setText] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const [chatInfo, setChatInfo] = useState([]);
  const [names, setNames] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([]);

  const getMessages = async (id) => {
    if (!selectedChat) return;
    const { data } = await axios.get(`api/message/${id}`, config);

    setMessages(data);
    socket.emit('join chat', chatInfo._id);
  };

  // const boo = () => {
  //   setSelectedChat('');
  //   setMessages([]);
  // };

  console.log(chats);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    axios.get('api/chat/', config).then((response) => {
      setChats(response.data);
      scrollToBottom();
    });
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [istyping]);

  useEffect(() => {
    getMessages(chatInfo._id);

    selectedChatCompare = chatInfo;
    // eslint-disable-next-line
  }, [chatInfo]);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    socket.emit('stop typing', chatInfo._id);

    if (text.trim().length !== 0) {
      const { data } = await axios.post(
        'api/message/',
        {
          content: text,
          chatId: selectedChat,
        },
        config
      );
      setText('');

      socket.emit('new message', data);

      setMessages([...messages, data]);
    }
  };

  const typingHandler = (e) => {
    setText(e.target.value);

    // Typing Logic indicator
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', chatInfo._id);
      console.log('a');
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      console.log(timeDiff);

      if (timeDiff >= timerLength) {
        console.log(timeNow);
        socket.emit('stop typing', chatInfo._id);

        setTyping(false);
      }
    }, timerLength);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  return (
    <>
      <div className='app'>
        <div
          className={`sidebar ${selectedChat.trim().length !== 0 && 'hide'}`}
        >
          <div className='sidebar__header'>
            <Avatar className='sidebar__avatar' />

            <div className='sidebar__input'>
              <SearchIcon />
              <input placeholder='Search' />
            </div>

            <IconButton variant='outlined' className='sidebar__inputButton'>
              <RateReviewOutlinedIcon />
            </IconButton>
          </div>

          <div className='sidebar__chats'>
            {chats.length > 0 &&
              chats.map((chat) => {
                return (
                  <div
                    className='sidebarChat'
                    onClick={() => {
                      setSelectedChat(chat._id);
                      setChatInfo(chat);
                      console.log(chat);
                    }}
                    key={chat._id}
                  >
                    <Avatar />

                    <div className='sidebarChat__info'>
                      <h3>
                        {chat.users.map((user) => {
                          console.log(chat);
                          return user._id
                            ? userId !== user._id
                              ? user.name + ' '
                              : ''
                            : 'user deleted';
                        })}
                      </h3>
                      <p>
                        {chat.latestMessage
                          ? chat.latestMessage.content.length > 25
                            ? chat.latestMessage.content.substring(0, 26) +
                              '...'
                            : chat.latestMessage.content
                          : ''}
                      </p>
                      <small>{chat.updatedAt.substring(12, 19)}</small>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className={`chat ${selectedChat.trim().length === 0 && 'hide'}`}>
          <div className='chat__header'>
            <ArrowBackIcon />
            <h4>
              To: <span className='chat__name'>Channel name</span>
            </h4>
            <strong>Details</strong>
          </div>
          <div className='chat__messages'>
            {messages.map((message) => {
              if (message.sender !== null) {
                return (
                  <div
                    className={`message ${
                      userId === message.sender._id && 'message__sender'
                    }`}
                    key={message._id}
                  >
                    <Avatar className='message__photo' />
                    <p>{message.content}</p>
                    <small>{message.updatedAt}</small>
                  </div>
                );
              }
            })}

            {istyping ? (
              <div className='message'>
                {<img src={typingg} style={{ width: 50, marginLeft: 0 }}></img>}
              </div>
            ) : (
              <></>
            )}

            <span style={{ marginBottom: 0 }} ref={messagesEndRef} />
          </div>

          <div className='chat__input'>
            <form>
              <input
                placeholder='message'
                type='text'
                value={text}
                onChange={typingHandler}
              />
              <button onClick={handleSubmit}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatpage;
