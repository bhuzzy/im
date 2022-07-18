import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//import Spinner from '../components/Spinner';
import io from 'socket.io-client';

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
  const [names, setNames] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('api/chat/', config).then((response) => {
      setChats(response.data);
      scrollToBottom();
    });
  }, [messages]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connection', () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare !== newMessageRecieved.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    getMessages(selectedChat);

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  const getMessages = async (id) => {
    if (!selectedChat) return;
    const { data } = await axios.get(`api/message/${id}`, config);

    setMessages(data);
    socket.emit('join chat', selectedChat);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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

  const boo = () => {
    setSelectedChat('');
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const usersmapped = chats.map((chat) =>
    chat.users.map((user) => {
      if (userId !== user._id) {
        return user.name;
      }
    })
  );

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
            {chats.map((chat) => {
              return (
                <div
                  className='sidebarChat'
                  onClick={() => {
                    setSelectedChat(chat._id);
                  }}
                  key={chat._id}
                >
                  <Avatar />

                  <div className='sidebarChat__info'>
                    <h3>
                      {chat.users.map(
                        (user) => user._id !== userId && user.name + ' '
                      )}
                    </h3>
                    <p>
                      {chat.latestMessage &&
                      chat.latestMessage.content.length > 25
                        ? chat.latestMessage.content.substring(0, 26) + '...'
                        : chat.latestMessage.content}
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
            <ArrowBackIcon onClick={boo} />
            <h4>
              To: <span className='chat__name'>Channel name</span>
            </h4>
            <strong>Details</strong>
          </div>
          <div className='chat__messages'>
            {messages.map((message) => {
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
            })}
            <span style={{ marginBottom: 0 }} ref={messagesEndRef} />
          </div>
          <div className='chat__input'>
            <form>
              <input
                placeholder='message'
                type='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
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
