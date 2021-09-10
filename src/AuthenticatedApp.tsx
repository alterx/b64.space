import React from 'react';
import { MainView } from './views/MainView';
import { ProfileView } from './views/ProfileView';
import { Switch, Route } from 'react-router-dom';

const AuthenticatedApp: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <MainView />
      </Route>
      <Route exact path="/profile/:userId">
        <ProfileView />
      </Route>
    </Switch>
  );
};

export default AuthenticatedApp;
