import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'api/users/chat';

function Chat() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then((response) => {
      setUsers(response.data);
    });
  }, []);
  return (
    <>
      <p> hello </p>
      {users.map((user) => (
        <li key={user._id}>{user.name}</li>
      ))}
    </>
  );
}

export default Chat;
