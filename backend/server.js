const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/userModel');
const userRoutes = require('./routes/userRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const repairRoutes = require('./routes/repairRoutes');

const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/Bazzzzza', {});

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/equipments', equipmentRoutes);
app.use('/repairRecords', repairRoutes);

const secretKey = 'BrawlStars@1488@';

app.post('/login', async (req, res) => {
  const { login, code } = req.body;

  try {
    const user = await User.findOne({ login, code });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      const token = jwt.sign({role: user.role, code: user.code}, secretKey, { expiresIn: '1h' });

      res.cookie('jwt', token, { httpOnly: true });

      res.json({ urole: user.role, ucode: user.code, uworkshop: user.workshop, token });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});