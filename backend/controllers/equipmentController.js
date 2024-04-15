const Equipment = require('../models/equipmentModel');
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

exports.createEquipment = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData && (tokenData.role !== 'admin' || tokenData.role !== 'master' )) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const equipment = new Equipment(req.body);
    const newEquipment = await equipment.save();
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
};

exports.getAllEquipment = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findOne({ id: req.params.id });
    if (!equipment) {
      return res.status(404).json({ message: 'Оборудование не найдено' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEquipmentById = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData && tokenData.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const deletedEquipment = await Equipment.findOneAndDelete({ id: req.params.id });
    if (!deletedEquipment) {
      return res.status(404).json({ message: 'Оборудование не найдено' });
    }
    res.json({ message: 'Оборудование удалено', deletedEquipment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNeedsRepairByInventory = async (req, res) => {
  const { inventoryNumber } = req.params;
  const { needsRepair } = req.body;

  try {
      const updatedEquipment = await Equipment.findOneAndUpdate(
          { inventoryNumber },
          { needsRepair },
          { new: true }
      );

      if (!updatedEquipment) {
          return res.status(404).json({ message: 'Оборудование с указанным инвентарным номером не найдено' });
      }

      res.json(updatedEquipment);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.updateLastMaintenanceDateById = async (req, res) => {
  const token = req.header('Authorization');
  const tokenData = verifyToken(token);

  if (!tokenData) {
    return res.status(403).json({ message: 'Доступ запрещен. Недостаточно прав.' });
  }
  try {
    const updatedEquipment = await Equipment.findOneAndUpdate(
      { id: req.params.id },
      { lastMaintenanceDate: req.body.lastMaintenanceDate },
      { new: true }
    );
    if (!updatedEquipment) {
      return res.status(404).json({ message: 'Оборудование не найдено' });
    }
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
