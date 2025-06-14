import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import './global.scss'
import { BrowserRouter } from 'react-router-dom';
import ProductContextProvider from './Context/ProductContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ProductContextProvider>
      <App />
    </ProductContextProvider>
  </BrowserRouter>
);
