const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

router.post('/', equipmentController.createEquipment);
router.get('/', equipmentController.getAllEquipment);
router.get('/:id', equipmentController.getEquipmentById);
router.delete('/:id', equipmentController.deleteEquipmentById);
router.patch('/needsRepairByInventory/:inventoryNumber', equipmentController.updateNeedsRepairByInventory);
router.patch('/lastMaintenanceDate/:id', equipmentController.updateLastMaintenanceDateById);

module.exports = router;
