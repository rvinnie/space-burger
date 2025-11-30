import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { App } from '@components/app/app';

import { store } from './services/store';

import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  // <StrictMode>
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>
  // </StrictMode>
);
