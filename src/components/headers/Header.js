import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import Profile from './Profile';
import '../../styles/Header.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const usercode = useSelector((state) => state.code.usercode);

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const openProfile = () => {
    setIsProfileOpen(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('jwt');
        const response = await axios.get(`http://localhost:5000/users/${usercode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (usercode) {
      fetchUser();
    }
  }, [usercode]);

  return (
    <div className='Header'>
      <div className='header_link'>
        <div className='Org_Name_logo'>
          <img src="/OrgLogo.png" alt="OrgLogo" className="OrgLogo" />
          <a className="OrgName">ТехноМехПлюс</a>
        </div>

        <button className="Profile" onClick={openProfile}>
          {user ? (
            <img src={user.photo ? `/${user.photo}` : '/NoProfile.jpg'} alt="Profile" className="ProfilePhoto" />
          ) : (
            <img src="/NoProfile.jpg" alt="NoProfile" className="NoProfile" />
          )}
        </button>
      </div>
      {isProfileOpen && (
        <Profile
          closeProfile={closeProfile}
        />
      )}
    </div>
  );
};

export default Header;