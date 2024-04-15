const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');

router.post('/', repairController.createRepairRecord);
router.delete('/:id', repairController.deleteRepairRecordById);
router.get('/', repairController.getAllRepairRecords);

module.exports = router;
