import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const User = () => {
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

  useEffect(() => {
    getUser(id);
  }, []);

  // if (loading) {
  //   return <div>loading</div>;
  // }

  if (!loading && info.length === 0) {
    return (
      <div>
        <h3>user not found</h3>
      </div>
    );
  }
  return (
    <>
      {loading && <h3>loading</h3>}
      <h2>
        {info.map((i) => {
          return i.name;
        })}
      </h2>
    </>
  );
};

export default User;
