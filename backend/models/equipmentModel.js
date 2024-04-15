const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  inventoryNumber: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /^[0-9]{6}$/.test(value),
      message: 'Inventory number should be a 6-digit number.',
    },
  },
  workshop: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  needsRepair: {
    type: Boolean,
    required: true,
  },
  lastMaintenanceDate: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
      message: 'Date should be in the format YYYY-MM-DD.',
    },
  },
  powerConsumption: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
