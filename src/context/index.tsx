import { BrowserRouter as Router } from 'react-router-dom';
import { GunProvider } from '@altrx/gundb-react-auth';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { CoreProvider } from './coreContext';
import Gun from 'gun';
import sea from 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';

const getDesignTokens = (mode: any) => ({
  palette: {
    mode,
    primary: {
      ...amber,
      ...(mode === 'dark' && {
        main: amber[300],
      }),
    },
    ...(mode === 'dark' && {
      background: {
        default: deepOrange[900],
        paper: deepOrange[900],
      },
    }),
    text: {
      ...(mode === 'light'
        ? {
            primary: grey[900],
            secondary: grey[800],
          }
        : {
            primary: '#fff',
            secondary: grey[500],
          }),
    },
  },
});

const asyncFn =
  (fn) =>
  (...args) => {
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
});

const AppProviders: React.FC = ({ children }) => {
  return (
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
          <CoreProvider>{children}</CoreProvider>
        </GunProvider>
      </Router>
    </ThemeProvider>
  );
};

export { AppProviders };
