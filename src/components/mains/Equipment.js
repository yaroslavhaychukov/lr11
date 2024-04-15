import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Hardware from './Hardware';
import FilterBlock from './FilterBlock';
import axios from 'axios'; 

import '../../styles/Equipment.css';

const Equipment = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedWorkshops, setSelectedWorkshops] = useState([]);
  const [needsRepair, setNeedsRepair] = useState(false);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageName, setpageName] = useState('Equipment');
  const userworkshop = useSelector((state) => state.workshop.workshop);
  const userrole = useSelector((state) => state.role.userrole);

  useEffect(() => {
    filterEquipment();
  }, [selectedWorkshops, needsRepair, selectedManufacturers, searchTerm, originalData]);

  useEffect(() => {
    fetchData(); 
  }, [userworkshop, userrole]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/equipments'); 
      const data = response.data;
      setOriginalData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const workshops = Array.from(new Set(originalData.map((equipment) => equipment.workshop)));
  const manufacturers = Array.from(new Set(originalData.map((equipment) => equipment.manufacturer)));

  const filterEquipment = () => {
    let updatedFilteredData = [...originalData];

    if (selectedWorkshops.length > 0) {
      updatedFilteredData = updatedFilteredData.filter((equipment) =>
        selectedWorkshops.includes(equipment.workshop)
      );
    }

    if (needsRepair) {
      updatedFilteredData = updatedFilteredData.filter((equipment) => equipment.needsRepair);
    }

    if (selectedManufacturers.length > 0) {
      updatedFilteredData = updatedFilteredData.filter((equipment) =>
        selectedManufacturers.includes(equipment.manufacturer)
      );
    }

    if (searchTerm) {
      updatedFilteredData = updatedFilteredData.filter((equipment) =>
        equipment.inventoryNumber.toString().includes(searchTerm)
      );
    }

    setFilteredData(updatedFilteredData);
  };

  const resetFilters = () => {
    setSelectedWorkshops([]);
    setNeedsRepair(false);
    setSelectedManufacturers([]);
    setSearchTerm('');
    setFilteredData(originalData);
  };

  return (
    <div className='Equipment'>
      <div>
        {filteredData.map((equipment) => (
          <Hardware key={equipment.id} {...equipment} />
        ))}
      </div>
      <div className='Filter'>
        <FilterBlock
          workshops={workshops}
          selectedWorkshops={selectedWorkshops}
          setSelectedWorkshops={setSelectedWorkshops}
          needsRepair={needsRepair}
          setNeedsRepair={setNeedsRepair}
          manufacturers={manufacturers}
          selectedManufacturers={selectedManufacturers}
          setSelectedManufacturers={setSelectedManufacturers}
          resetFilters={resetFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          page={pageName}
        />
      </div>
    </div>
  );
};

export default Equipment;
