import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Chatpage() {
  const user = JSON.parse(localStorage.getItem('user'));

  const token = user.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [chats, setChats] = useState([]);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('api/chat/all').then((response) => {
      setChats(response.data);
      //console.log(response.data);
    });
  }, []);

  useEffect(() => {});

  const getMessages = async (id) => {
    const { data } = await axios.get(`api/message/${id}`, config);
    console.log(data);
    setMessages(data);
  };

  return (
    <>
      {chats.map((chat) => {
        return (
          <div
            className='left'
            onClick={() => getMessages(chat._id)}
            key={chat._id}
          >
            {chat.latestMessage.sender.name} <br></br>
            {chat.latestMessage.content}
          </div>
        );
      })}
      {messages.map((message) => {
        return <div key={message._id}>{message.content}</div>;
      })}
    </>
  );
}

export default Chatpage;
