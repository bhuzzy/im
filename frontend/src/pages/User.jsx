import axios from 'axios';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const User = () => {
  const { id } = useParams();

  const getUser = async (id) => {
    const user = await axios.get(id);
    console.log(user.data);
    return user.data;
  };

  getUser(id);

  return <div>User</div>;
};

export default User;
