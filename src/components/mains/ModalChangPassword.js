import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const ModalChangPassword = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [newPas, setNewPas] = useState('');
  const [newPas2, setNewPas2] = useState('');

  const handleOpen = () => {
    setOpen(true);
    setCode('');
    setEmail('');
    setMessage('');
    setNewPas('');
    setNewPas2('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verifyCodeAndEmail', {
        code,
        email,
      });

      if (response.data.message === 'Совпадает') {
        setMessage('Совпадает');
      } else {
        setMessage('Неверный код или email');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  const handleSavePas = async () => {
    if (newPas === newPas2) {
      try {
        await axios.patch('http://localhost:5000/changePasswordByCode', {
          code,
          newPassword: newPas,
        });

        setMessage('Пароль успешно изменен');
      } catch (error) {
        console.error('Ошибка при установке нового пароля:', error);
      }
    } else {
      setMessage('Пароли не совпадают');
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen} style={{fontSize: "10px"}}>
        Забыли пароль?
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <div className='ModalLogin'>
          <h2>СМЕНА ПАРОЛЯ</h2>
          {message !== 'Совпадает' ? (
            <>
              <TextField
                label="Введите код"
                variant="outlined"
                type="text"
                value={code}
                onChange={handleCodeChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Введите email"
                variant="outlined"
                type="email"
                value={email}
                onChange={handleEmailChange}
                fullWidth
                margin="normal"
              />
              <p>
                <span style={{ color: "red" }}>{message}</span>
              </p>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Отправить
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Введите новый пароль"
                variant="outlined"
                type="password"
                value={newPas}
                onChange={(e) => setNewPas(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Повторите пароль"
                variant="outlined"
                type="password"
                value={newPas2}
                onChange={(e) => setNewPas2(e.target.value)}
                fullWidth
                margin="normal"
              />
              {newPas !== newPas2 && (
                <p>
                  <span style={{ color: "red" }}>Пароли не совпадают</span>
                </p>
              )}
              <Button onClick={handleSavePas} variant="contained" color="primary">
                Сохранить
              </Button>
            </>
          )}
          <Button onClick={handleClose}>Закрыть</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ModalChangPassword;
