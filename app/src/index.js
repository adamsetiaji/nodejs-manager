import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NodejsManager from './components/NodejsManager';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NodejsManager />
  </React.StrictMode>
);