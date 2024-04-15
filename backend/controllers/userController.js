const User = require('../models/userModel');
const secretKey = 'BrawlStars@1488@';
const jwt = require('jsonwebtoken');


const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token.slice(7), secretKey);
    console.log('Декодированный токен:', decoded);
    return decoded;
  } catch (error) {
    console.error('Ошибка при верификации токена:', error);
    return null;
  }
};

exports.createUser = async (req, res) => {
 
  const { code, firstName, lastName, photo, accounts } = req.body;

  const user = new User({
    code,
    firstName,
    lastName,
    photo,
    accounts,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ code: req.params.code });
    if (!deletedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    console.log('Удаленный пользователь:', deletedUser);
    res.json({ message: 'Пользователь удален', deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserByCode = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  try {
    const user = await User.findOne({ code: req.params.code });
    if (!tokenData || tokenData.code !== user.code) {
      return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
    }
    if (!user) {
      console.log('Пользователь не найден.');
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    console.log('Пользователь найден:', user);
    res.json(user);
  } catch (error) {
    console.error('Ошибка при поиске пользователя:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyCodeAndEmail = async (req, res) => {
  const { code, email } = req.body;

  try {
    const user = await User.findOne({ code, email });

    if (!user) {
      return res.status(404).json({ message: 'Неверный код или email' });
    }

    res.status(200).json({ message: 'Совпадает' });
  } catch (error) {
    console.error('Ошибка при проверке кода и email:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.changePasswordByCode = async (req, res) => {
  const { code, newPassword } = req.body;

  try {
    const user = await User.findOne({ code });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Ошибка при изменении пароля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};