import React from 'react';
import { Contact } from './components/contacts/contact';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./App.css"
function App() {
  return (
    <>
    <Contact/>
    <ToastContainer/>
   </>
  );
}

export default App;
