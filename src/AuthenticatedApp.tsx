import React from 'react';
import { useCore } from './context/coreContext';
import { MainView } from './views/MainView';
import { ProfileView } from './views/ProfileView';
import { Switch, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const AuthenticatedApp: React.FC = () => {
  const { get364node, useMyInbox } = useCore();
  const postsRef = get364node('posts');
  const notificationsRef = get364node('notifications');
  useMyInbox(postsRef, notificationsRef);
  return (
    <Container maxWidth="xl">
      <Box mt={2}>
        <Container style={{ maxWidth: 700 }}>
          <Switch>
            <Route exact path="/">
              <MainView />
            </Route>
            <Route exact path="/profile/:userId">
              <ProfileView />
            </Route>
          </Switch>
        </Container>
      </Box>
    </Container>
  );
};

export default AuthenticatedApp;
