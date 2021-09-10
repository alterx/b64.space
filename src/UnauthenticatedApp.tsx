import React from 'react';
import { useAuth } from '@altrx/gundb-react-auth';

export default function LoginView() {
  const { login } = useAuth();
  async function getApp(type: string, value?: string) {
    try {
      let keys;

      if (type !== 'new') {
        if (typeof value === 'string') {
          keys = JSON.parse(value);
        } else {
          keys = value;
        }
      }
      login(keys);
    } catch (e) {}
  }

  return (
    <div className="login">
      <h1 id="appName">364</h1>
      <button
        onClick={() => {
          getApp('new');
        }}
      >
        New user
      </button>
      <h2>Already have one?</h2>
      <input
        onChange={(e) => {
          const { target } = e;
          getApp('existing', target.value);
        }}
        placeholder="Paste keys here"
      />
    </div>
  );
}
