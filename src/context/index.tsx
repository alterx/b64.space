import { BrowserRouter as Router } from 'react-router-dom';
import { GunProvider } from '@altrx/gundb-react-auth';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CoreProvider } from './coreContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Gun from 'gun';
import sea from 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';

import { ToastContextProvider } from './toastContext';

const asyncFn =
  (fn: any) =>
  (...args: any[]) => {
    return new Promise(function (this: any, resolve) {
      resolve(fn.call(this, ...args));
    });
  };

const storage = {
  setItem: asyncFn(localStorage.setItem.bind(localStorage)),
  getItem: asyncFn(localStorage.getItem.bind(localStorage)),
  removeItem: asyncFn(localStorage.removeItem.bind(localStorage)),
};

const peers = ['http://localhost:8765/gun'];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: ['Poppins'].join(','),
  },
});

const AppProviders: React.FC = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <GunProvider
            peers={peers}
            sea={sea}
            Gun={Gun}
            keyFieldName="364Keys"
            storage={storage}
            gunOpts={{
              localStorage: false,
              radisk: true,
              peers,
            }}
          >
            <CoreProvider>
              <ToastContextProvider>{children}</ToastContextProvider>
            </CoreProvider>
          </GunProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export { AppProviders };
