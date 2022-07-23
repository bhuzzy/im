import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useHistory, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import '../css/user.css';

const User = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const userId = user._id;

  const token = user.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { id } = useParams();

  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUser = async (id) => {
    try {
      const { data } = await axios.get(`/api/users/get/${id}`);
      setInfo(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (userId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const data = await axios.post('/api/chat/', { userId: userId }, config);
      // if this runs that means promise was fulfilled?
      toChat();
    } catch (err) {
      console.log(err);
    }
  };

  async function toChat() {}

  useEffect(() => {
    getUser(id);
  }, []);

  if (!loading && info.length === 0) {
    return (
      <div>
        <h3>user not found</h3>
      </div>
    );
  }
  return (
    <>
      {loading && <Spinner />}

      {info.map((i) => {
        return (
          <div className='profile' key={i._id}>
            <img src={i.pic}></img>
            <h2>{i.name}</h2>
            <h3>{i.username && i.username}</h3>
            <Link to='../chat' state={{ from: i._id }}>
              message
            </Link>

            <br></br>
            <button>unlock premium $15</button>
            <br></br>
            <button>follow</button>
            <br></br>
          </div>
        );
      })}
    </>
  );
};

export default User;
