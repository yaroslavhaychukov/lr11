const RepairRecord = require('../models/repairModel');
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

exports.createRepairRecord = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData && (tokenData.role !== 'admin' || tokenData.role !== 'master' )) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  try {
    const repairRecord = new RepairRecord(req.body);
    const newRepairRecord = await repairRecord.save();
    res.status(201).json(newRepairRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRepairRecordById = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData && tokenData.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }

  try {
    const deletedRepairRecord = await RepairRecord.findOneAndDelete({ id: req.params.id });
    if (!deletedRepairRecord) {
      return res.status(404).json({ message: 'Запись о ремонте не найдена' });
    }
    res.json({ message: 'Запись о ремонте удалена', deletedRepairRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRepairRecordById = async (req, res) => {
  try {
    const repairRecord = await RepairRecord.findById(req.params.id);
    if (!repairRecord) {
      return res.status(404).json({ message: 'Запись о ремонте не найдена' });
    }
    res.json(repairRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRepairRecords = async (req, res) => {
  try {
    const repairRecords = await RepairRecord.find();
    res.json(repairRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};