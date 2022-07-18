import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//import Spinner from '../components/Spinner';

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

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('api/chat/', config).then((response) => {
      setChats(response.data);
    });
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessages = async (id) => {
    const { data } = await axios.get(`api/message/${id}`, config);

    setMessages(data);
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
                    getMessages(chat._id);
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
