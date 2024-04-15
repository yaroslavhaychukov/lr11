import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, Button, FormGroup, FormControlLabel, Typography, Autocomplete } from '@mui/material';
import Input from '@mui/material/Input';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Cookies from 'js-cookie';
import '../../styles/CreateBlock.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CreateBlock = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const userworkshop = useSelector((state) => state.workshop.workshop);
  const userrole = useSelector((state) => state.role.userrole);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/equipments');
      setEquipmentData(response.data);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };

  const workshops = Array.from(new Set(equipmentData.map((equipment) => equipment.workshop)));
  const [newEquipment, setNewEquipment] = useState({
    inventoryNumber: '',
    workshop: '',
    name: '',
    needsRepair: false,
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    powerConsumption: '',
    manufacturer: '',
    logo: '',
  });

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const [maintenanceRecord, setMaintenanceRecord] = useState({
    inventoryNumber: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    cost: '',
  });

  const handleEquipmentChange = (event) => {
    const { name, value, checked } = event.target;
    setNewEquipment((prevEquipment) => ({
      ...prevEquipment,
      [name]: name === 'needsRepair' ? checked : value,
    }));
  };

  const handleMaintenanceChange = (event) => {
    const { name, value } = event.target;
    setMaintenanceRecord((prevMaintenanceRecord) => ({
      ...prevMaintenanceRecord,
      [name]: value,
    }));
  };

  const handleCreateEquipment = async () => {
    try {
      let imgName = '';
      const imageData = new FormData();
      imageData.append('file', imageFile);

      const response = await axios.post('http://localhost:5001/upload/image', imageData);
      console.log(response.data.fileName);
      imgName = (response.data.fileName);
      newEquipment.logo = imgName;
      const token = Cookies.get('jwt');
      await axios.post('http://localhost:5000/equipments', newEquipment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('New equipment created:', newEquipment);
    } catch (error) {
      console.error('Error creating new equipment:', error);
    }
  };

  const handleMaintenanceRecord = async () => {
    try {
      const token = Cookies.get('jwt');
      await axios.post('http://localhost:5000/repairRecords', maintenanceRecord, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await axios.patch(`http://localhost:5000/equipments/needsRepairByInventory/${maintenanceRecord.inventoryNumber}`, {
        needsRepair: false,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Maintenance record recorded:', maintenanceRecord);
    } catch (error) {
      console.error('Error recording maintenance record:', error);
    }
  };

  return (
    <div>
      {(userrole === 'admin') &&
        <div className='NewEquipment'>
          <h1>Создать новое оборудование</h1>
          <FormGroup>
            <TextField
              type="text"
              label="Инвентарный номер"
              name="inventoryNumber"
              value={newEquipment.inventoryNumber}
              onChange={handleEquipmentChange}
            />
            <Autocomplete
              style={{ margin: '0 40px 0 0' }}
              options={workshops}
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="text"
                  label="Цех"
                />
              )}
              value={newEquipment.workshop}
              onChange={(event, newValue) => {
                setNewEquipment(prevEquipment => ({
                  ...prevEquipment,
                  workshop: newValue
                }));
              }}
            />
            <TextField
              type="text"
              label="Название"
              name="name"
              value={newEquipment.name}
              onChange={handleEquipmentChange}
            />
            <FormControlLabel
              style={{ marginLeft: "20px", marginTop: "20px" }}
              control={
                <Checkbox
                  checked={newEquipment.needsRepair}
                  onChange={handleEquipmentChange}
                  name="needsRepair"
                />
              }
              label="Нуждается в ремонте"
            />
            <TextField
              type="text"
              label="Дата последнего обслуживания"
              name="lastMaintenanceDate"
              value={newEquipment.lastMaintenanceDate}
              onChange={handleEquipmentChange}
            />
            <TextField
              type="text"
              label="Потребление энергии"
              name="powerConsumption"
              value={newEquipment.powerConsumption}
              onChange={handleEquipmentChange}
            />
            <TextField
              type="text"
              label="Производитель"
              name="manufacturer"
              value={newEquipment.manufacturer}
              onChange={handleEquipmentChange}
            />
            <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        component="label"
      >
        Загрузить лого
        <Input
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </Button>
          </FormGroup>
          <Button variant="contained" color="primary" onClick={handleCreateEquipment}>
            Создать оборудование
          </Button>
        </div>
      }

      <div className='CreateRecord'>
        <h1>Создание записи о ремонте</h1>
        <FormGroup>
          <TextField
            type="text"
            label="Инвентарный номер"
            name="inventoryNumber"
            value={maintenanceRecord.inventoryNumber}
            onChange={handleMaintenanceChange}
          />
          {maintenanceRecord.inventoryNumber.length > 5 &&
            !equipmentData.some(
              (equipment) => equipment.inventoryNumber.toString() === maintenanceRecord.inventoryNumber
            ) ? (
            <p style={{ marginLeft: "20px", fontWeight: "bold", color: "red" }}>
              Такой записи не существует
            </p>
          ) : equipmentData.map((equipment) => {
            if (equipment.inventoryNumber.toString() === maintenanceRecord.inventoryNumber) {
              if (equipment.workshop !== userworkshop &&  userrole !== 'admin') {
                return (
                  <p key={equipment._id} style={{ marginLeft: "20px", fontWeight: "bold", color: "red" }}>
                    Это оборудование не из вашего цеха
                    {userworkshop}
                  </p>
                );
              } else {
                return (
                  <p key={equipment._id} style={{ marginLeft: "20px", fontWeight: "bold", color: "red" }}>
                    {equipment.name}
                  </p>
                );
              }
            }
            return null;
          })
          }
          <TextField
            type="text"
            label="Дата обслуживания"
            name="maintenanceDate"
            value={maintenanceRecord.maintenanceDate}
            onChange={handleMaintenanceChange}
          />
          <TextField
            type="text"
            label="Описание"
            name="description"
            value={maintenanceRecord.description}
            onChange={handleMaintenanceChange}
          />
          <TextField
            type="number"
            label="Стоимость"
            name="cost"
            value={maintenanceRecord.cost}
            onChange={handleMaintenanceChange}
          />
        </FormGroup>
        <Button variant="contained" color="primary" onClick={handleMaintenanceRecord}>
          Записать обслуживание
        </Button>
      </div>
    </div>
  );
};

export default CreateBlock;
