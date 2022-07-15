import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Chatpage() {
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

  const getMessages = async (id) => {
    const { data } = await axios.get(`api/message/${id}`, config);
    console.log(data);
    setMessages(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
  };

  return (
    <>
      <div className='left'>
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
              {chat.latestMessage.content}
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
              <span>{message.content}</span>
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
      </div>
    </>
  );
}

export default Chatpage;
