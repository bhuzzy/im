import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Settings = () => {
  const [formData, setFormData] = useState({
    username: '',
  });

  const { username } = formData;

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const token = user.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
    };

    const response = await axios.post('/api/users/settings', userData, config);

    console.log(response);
  };
  return (
    <>
      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='username'
              name='username'
              value={username}
              onChange={onChange}
              placeholder='Enter your username'
              required
            />
          </div>

          <div className='form-group'>
            <button className='btn btn-block'>Submit</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Settings;
