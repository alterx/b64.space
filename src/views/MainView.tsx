import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useAuth } from '@altrx/gundb-react-auth';
import { MessageList } from '../components/MessageList';
import Compose from '../components/Compose';
import { useFetchPosts } from '../utils/feed';
import { Typography, Button } from '@mui/material';

export const MainView: React.FC = () => {
  const { appKeys } = useAuth();
  const history = useHistory();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2">Home</Typography>
        <Button
          onClick={() => {
            history.push(`/profile/${appKeys.pub}`);
          }}
        >
          My profile
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Compose pub={appKeys.pub} />

          <MessageList keys={appKeys} />
        </Grid>
      </Grid>
    </Grid>
  );
};
