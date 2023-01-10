import React from 'react';
import ReactDOM from 'react-dom/client';
import Views from './App';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <BrowserRouter>
      <Views />
    </BrowserRouter>
  </React.StrictMode>
  
);
