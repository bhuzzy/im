import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'api/chat';

function Chat() {
  const [users, setUsers] = useState([]);

  /* const token = JSON.parse(localStorage.getItem('user'));
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
  }, [config]); */

  /*const userslist = chats.map(({ users }) => ({
    name: user.name,
  }));

  console.log(userslist);*/

  //console.log(chats);

  // const usersmapped = chats.map((chat) =>
  //   chat.users.map((user) => {
  //     return user._id === userId ? 'yes' : user.name;
  //   })
  // );

  //const usermapped = usersmapped.map((user) => user);

  // console.log(usersmapped);

  // const usermapped = usersmapped[0];

  // const checkid = (age) => {
  //   return age === userId;
  // };

  // const filtered = usersmapped.filter(checkid);

  //console.log(filtered);
  //console.log(usersmapped[0]);
  //console.log();

  //console.log(usermapped);

  // const [nameso, setNameso] = useState([]);

  // const one = () =>
  //   nameso
  //     .map((n, index) => {
  //       if (nameso.length > index + 2) {
  //         return n + ', ';
  //       } else if (nameso.length === index + 2) {
  //         return n + ' & ';
  //       } else {
  //         return n;
  //       }
  //     })
  //     .join('');

  // pubCheck();

  // const pubId = nanoid();
  // const { data } = await axios.get(`api/users/${pubId}`);

  // const pubCheck = async () => {
  //   do {
  //     const pubId = nanoid();
  //     const { data } = await axios.get(`api/users/${pubId}`);
  //   } while (data);
  //   return pubId;
  // };
  return (
    <>
      <p> hello </p>
    </>
  );
}

export default Chat;
