import React from 'react';
import Modal from './Modal.js';

const Hardware = ({ inventoryNumber, workshop, name, needsRepair, data, powerConsumption, manufacturer, logo }) => {

  return (
    <div className='Hardware'>
      <h3>{name}</h3>
      <p>Цех: <span style={{ fontWeight: 'bold' }}>{workshop}</span></p>
      <p>Необходим ремонт: <span style={{ fontWeight: 'bold' }}>{needsRepair ? 'Да' : 'Нет'}</span></p>
      <p>Инвентарный номер:<span style={{ fontWeight: 'bold' }}> {inventoryNumber}</span></p>
      <Modal
        name={name}
        workshop={workshop}
        powerConsumption={powerConsumption}
        manufacturer={manufacturer}
        logo={logo}
        inventoryNumber={inventoryNumber}
        needsRepair ={needsRepair}
      />
    </div>
  );
};

export default Hardware;
