const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
      message: 'Date should be in the format YYYY-MM-DD.',
    },
  },
  cost: {
    type: Number,
    required: true,
  },
  inventoryNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const RepairRecord = mongoose.model('RepairRecord', repairSchema);

module.exports = RepairRecord;
