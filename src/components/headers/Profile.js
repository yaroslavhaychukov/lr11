import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveCode, clearCode } from '../../store/actions/action1';
import { saveRole, clearRole } from '../../store/actions/action2';
import { saveWorkshop, clearWorkshop  } from '../../store/actions/action3';
import Modal from '../mains/ModalChangPassword';
import axios from 'axios';
import '../../styles/Profile.css';
import Cookies from 'js-cookie';
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

const Profile = ({ closeProfile }) => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const usercode = useSelector((state) => state.code.usercode);
  const workshop = useSelector((state) => state.workshop.workshop);
  const [currentUser, setCurrentUser] = useState(null);

  const handleAuthorize = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { code, password });

      const { urole, ucode, uworkshop, token } = response.data;

      Cookies.set('jwt', token);
      dispatch(saveCode(ucode));
      dispatch(saveRole(urole))
      dispatch(saveWorkshop(uworkshop));
      closeProfile();
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
    }
    setCode('');
    setPassword('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    dispatch(clearCode());
    dispatch(clearRole());
    dispatch(clearWorkshop());
    Cookies.remove('jwt');
    closeProfile();
    window.location.reload();
  };

  useEffect(() => {
    if(usercode) {
      
      fetchUser();
    }
  }, [usercode]);

  const fetchUser = async () => {
    try {
      const token = Cookies.get('jwt');
      const response = await axios.get(`http://localhost:5000/users/${usercode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;
      setCurrentUser(user);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  };

  return (
    <Card className="profile-dropdown">
      <CardContent>
        {currentUser ? (
          <div className="user-info">
            <p>{currentUser.firstName} {currentUser.lastName}</p>
            <p>{workshop}</p>
            <Button variant="contained" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        ) : (
          <div className="login-form">
            <Typography variant="body1">Ваш код:</Typography>
            <TextField
              type="text"
              placeholder="Код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Typography variant="body1">Ваш пароль:</Typography>
            <TextField
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" onClick={handleAuthorize}>
              Войти
            </Button>
          </div>
        )}
        <Modal />
        <Button onClick={closeProfile}>Close</Button>
      </CardContent>
    </Card>
  );
};

export default Profile;
