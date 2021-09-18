import { useParams } from 'react-router-dom';
import { useAuth } from '@altrx/gundb-react-auth';
import { useCore } from '../context/coreContext';
import Grid from '@mui/material/Grid';
import { MessageList } from './MessageList';
import { useEffect } from 'react';

export const PublicProfile: React.FC<{ profile: any }> = ({ profile }) => {
  const { userId } = useParams<any>();
  const { appKeys: myKeys } = useAuth();
  const { get364node } = useCore();

  // my own reactions node
  const reactionsRef = get364node('reactions');

  useEffect(() => {
    // get the posts index in my local
    // it seems like Gun cannot get new data from inside the worker
    // TODO do more research on this
    get364node('postsByDate', false, userId).once(() => {});
  }, [get364node, userId]);

  const { epub, pub, inbox } = profile;

  return (
    <Grid container spacing={3}>
      <MessageList
        filter={userId}
        reactionsRef={reactionsRef}
        epub={epub}
        pub={pub || userId}
        inbox={inbox}
        theirKeys={{ epub, pub }}
        keys={myKeys}
      />
    </Grid>
  );
};
