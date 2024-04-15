import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Equipment from './Equipment';
import CreateBlock from './CreateBlock';
import Journal from './Journal';
import Reports from './Reports';
const Main = ({ code }) => {

  return (  
    <Routes>      
      <Route path="Equipment" element={<Equipment code={code} />} />
      <Route path="CreateBlock" element={<CreateBlock code={code} />} />
      <Route path="Journal" element={<Journal code={code} />} />     
      <Route path="Reports" element={<Reports/>} />   
    </Routes>
  );
};

export default Main;
