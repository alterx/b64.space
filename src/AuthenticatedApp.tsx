import React, { useEffect } from 'react';
import { useCore } from './context/coreContext';
import { MainView } from './views/MainView';
import { ProfileView } from './views/ProfileView';
import { Switch, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import { useAuth } from '@altrx/gundb-react-auth';
import Box from '@mui/material/Box';
import { useGunState } from '@altrx/gundb-react-hooks';

const AuthenticatedApp: React.FC = () => {
  const { get364node, useMyInbox, indexFollowees } = useCore();
  const { appKeys } = useAuth();
  const postsRef = get364node('posts');
  const notificationsRef = get364node('notifications');

  const { fields: followees } = useGunState<any>(get364node('followees'));

  console.log('followees', followees);
  useEffect(() => {
    indexFollowees([...Object.keys(followees), appKeys.pub]);
  }, [appKeys.pub, followees, indexFollowees]);

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
