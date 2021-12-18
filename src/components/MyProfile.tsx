import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import { MessageList } from './MessageList';

export const MyProfile: React.FC<{ profile: any }> = ({ profile }) => {
  const { userId } = useParams<any>();
  const { pub } = profile;

  return (
    <Grid container spacing={3}>
      <MessageList
        filter={pub || userId}
        theirKeys={{ pub: pub || userId }}
        keys={{ pub: pub || userId }}
      />
    </Grid>
  );
};
