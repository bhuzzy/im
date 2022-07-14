import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'api/chat';

function Chat() {
  const [users, setUsers] = useState([]);

  const token = JSON.parse(localStorage.getItem('user'));
  //console.log(JSON.parse(localStorage.getItem('user')));

  const usertoken = token.token;
  console.log(usertoken);

  const config = {
    headers: {
      Authorization: `Bearer ${usertoken}`,
    },
  };

  useEffect(() => {
    axios.get(API_URL, config).then((response) => {
      setUsers(response.data);
    });
  }, [config]);
  return (
    <>
      <p> hello </p>
      {users.map((user) => (
        <li key={user._id}>{users.name}</li>
      ))}
    </>
  );
}

export default Chat;
