import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { useAuth, KeyPair } from '@altrx/gundb-react-hooks';
import { MessageList } from '../components/MessageList';
import { Typography, Button } from '@mui/material';
import Compose from '../components/Compose';

export const MainView: React.FC = () => {
  const appKeys = useAuth().appKeys as KeyPair;
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Typography variant="h2">Home</Typography>
        <Button
          onClick={() => {
            navigate(`/profile/${appKeys.pub}`);
          }}
        >
          My profile
        </Button>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={0}>
          <Compose pub={appKeys.pub} isMain />
          <MessageList keys={appKeys} />
        </Grid>
      </Grid>
    </Grid>
  );
};
