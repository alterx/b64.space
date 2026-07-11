import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@altrx/gundb-react-hooks';
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

// Kept at module scope so the object identity is stable across renders —
// v1.0's useGun re-initializes the Gun instance whenever gunOpts changes.
const gunOpts = {
  localStorage: false,
  radisk: true,
  peers,
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: ['Poppins'].join(','),
  },
});

const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <AuthProvider
            sea={sea}
            Gun={Gun}
            keyFieldName="364Keys"
            storage={storage}
            gunOpts={gunOpts}
          >
            <CoreProvider>
              <ToastContextProvider>{children}</ToastContextProvider>
            </CoreProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export { AppProviders };
