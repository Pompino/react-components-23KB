import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

const root = "/ui"

ReactDOM.render(
  <React.StrictMode>
    <App appRoot={root}/>
  </React.StrictMode>,
  document.getElementById('root')
);