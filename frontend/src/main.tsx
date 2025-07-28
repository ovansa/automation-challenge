import './index.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import QuickPostApp from '../src/App';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<QuickPostApp mode='login' />} />
        <Route path='/register' element={<QuickPostApp mode='register' />} />
        <Route path='/dashboard' element={<QuickPostApp mode='dashboard' />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
