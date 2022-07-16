import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

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

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('api/chat/all').then((response) => {
      setChats(response.data);
      //console.log(response.data);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessages = async (id) => {
    const { data } = await axios.get(`api/message/${id}`, config);
    console.log(data);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  return (
    <>
      <div className='app'>
        <div className='sidebar'>
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

          {chats.map((chat) => {
            return (
              <div
                onClick={() => {
                  getMessages(chat._id);
                  setSelectedChat(chat._id);
                }}
                key={chat._id}
              >
                {chat.latestMessage.sender.name} <br></br>
                {chat.latestMessage.content.length > 50
                  ? chat.latestMessage.content.substring(0, 51) + '...'
                  : chat.latestMessage.content}
              </div>
            );
          })}
        </div>

        <div className='right'>
          {messages.map((message) => {
            return (
              <div
                className={`${
                  userId === message.sender._id ? 'messageright' : 'messageleft'
                }`}
                key={message._id}
              >
                <p>{message.content}</p>
              </div>
            );
          })}
          <form className='typemessageform' onSubmit={handleSubmit}>
            <label>
              <input
                className='typemessageinput'
                type='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
            <input type='submit' />
          </form>
          <span style={{ marginBottom: 100 }} ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
}

export default Chatpage;
