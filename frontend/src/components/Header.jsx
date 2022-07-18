import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  console.log('hi');

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    clearInput();
    navigate('/');
  };

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState('');

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);

    !searchWord ? setFilteredData([]) : searchUsers(searchWord);
  };

  const searchUsers = async (searchWord) => {
    const { data } = await axios.get(`api/users/${searchWord}`);
    setFilteredData(data);
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered('');
  };

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/' onClick={clearInput}>
          Paper.chat
        </Link>
      </div>
      <div className='search'>
        <div className='searchInputs'>
          <input
            placeholder='Search for accounts'
            type='text'
            value={wordEntered}
            onChange={handleFilter}
          />
          <div className='searchIcon'>
            {wordEntered.length === 0 ? (
              <SearchIcon />
            ) : (
              <CloseIcon id='clearBtn' onClick={clearInput} />
            )}
          </div>
        </div>
        {filteredData.length != 0 && (
          <div className='dataResult'>
            {filteredData.slice(0, 15).map((value, key) => {
              return (
                <a className='dataItem' href={value.name}>
                  <p>{value.name} </p>
                </a>
              );
            })}
          </div>
        )}
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <Link to='chatpage' onClick={clearInput}>
                <AiOutlineMessage />
              </Link>
            </li>
            <li>
              <FiLogOut onClick={onLogout} />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='login' onClick={clearInput}>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to='register' onClick={clearInput}>
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
