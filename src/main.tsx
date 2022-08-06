import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AppProviders } from './context';
import App from './App';

ReactDOM.render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
  document.getElementById('root')
);
