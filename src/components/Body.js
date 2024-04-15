import React, { useState, useEffect } from 'react';
import Header from './headers/Header';
import Main from './mains/Main';
import Footer from './footers/Footer';
import NavigateBar from './headers/Navigate'
import { clearCode } from '../store/actions/action1';
import { clearRole } from '../store/actions/action2';
import { clearWorkshop  } from '../store/actions/action3';
import { useDispatch } from 'react-redux';

const Body = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cleanupOnUnload = () => {
      dispatch(clearCode());
      dispatch(clearRole());
      dispatch(clearWorkshop());
    };

    window.addEventListener('beforeunload', cleanupOnUnload);

    return () => {
      window.removeEventListener('beforeunload', cleanupOnUnload);
    };
  }, [dispatch]);

  return (
    <div>
      <header>
        <Header /> 
<NavigateBar/>
      </header>
      <main>
      <Main/>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Body;
