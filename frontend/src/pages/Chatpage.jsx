import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Chatpage() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get('api/chat/all').then((response) => {
      setChats(response.data);
    });
  }, []);

  return (
    <>
      {chats.map((chat) => {
        return <li key={chat._id}>{chat.chatName}</li>;
      })}
    </>
  );
}

export default Chatpage;
