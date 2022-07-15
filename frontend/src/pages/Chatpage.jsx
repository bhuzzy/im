import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Chatpage() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get('api/chat/all').then((response) => {
      setChats(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <>
      {chats.map((chat) => {
        return (
          <div className='left' key={chat._id}>
            {chat.latestMessage.sender.name} <br></br>
            {chat.latestMessage.content}
          </div>
        );
      })}
    </>
  );
}

export default Chatpage;
