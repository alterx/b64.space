import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GunProvider } from '@altrx/gundb-react-auth';
import { CoreProvider } from './coreContext';
import Gun from 'gun';
import sea from 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';

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

const AppProviders: React.FC = ({ children }) => {
  return (
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
  );
};

export { AppProviders };
