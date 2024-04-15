import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import '../../styles/Equipment.css';
import axios from 'axios';
import Cookies from 'js-cookie';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Modal = ({ name, workshop, powerConsumption, manufacturer, logo, inventoryNumber, needsRepair }) => {
    const [open, setOpen] = useState(false);
    const userrole = useSelector((state) => state.role.userrole);
    const userworkshop = useSelector((state) => state.workshop.workshop);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNeedsRepair = async () => {
        try {
            const token = Cookies.get('jwt');
            const response = await axios.patch(`http://localhost:5000/equipments/needsRepairByInventory/${inventoryNumber}`, { needsRepair: true }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Статус ремонта обновлен успешно:', response.data);
        } catch (error) {
            console.error('Ошибка при обновлении статуса ремонта:', error);
        }
    };
    

    return (
        <div className='Modal'>
            <Button
                onClick={handleOpen}
                style={{
                    marginLeft: 'calc(99% - 70px)',
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            >
                <MoreHorizIcon />
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <div className='ModalPage'>
                    {logo ? (
                        <img src={logo} alt={logo} onError={() => console.error("Ошибка загрузки изображения")} className="logo" />
                    ) : (
                        <img src="errorpage.png" alt="Ошибка загрузки" className="logo" />
                    )}
                    <h2>{name}</h2>
                    <div className='ModalText'>

                        <p>Цех: {workshop}</p>
                        <p>Питание: {powerConsumption}</p>
                        <p>Производитель: {manufacturer}</p>
                        <p>Инвентарный номер: {inventoryNumber}</p> 
                         {(userrole === 'admin' || userrole === 'master') && (userworkshop === workshop || userrole === 'admin') && needsRepair === 'false' && (
                        <Button variant="contained" color="primary" onClick={handleNeedsRepair}>
                            Нуждается в ремонте
                        </Button>
                    )}
                    </div>
                  
                </div>
            </Dialog>
        </div>
    );
};

export default Modal;
