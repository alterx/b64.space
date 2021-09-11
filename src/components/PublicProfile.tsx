import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { indexUser } from '../utils/feed';
import { useAuth } from '@altrx/gundb-react-auth';
import { useCore } from '../context/coreContext';
import Grid from '@mui/material/Grid';
import { MessageList } from './MessageList';

export const PublicProfile: React.FC<{ profile: any }> = ({ profile }) => {
  const { userId } = useParams();
  const { appKeys: myKeys } = useAuth();
  const { get364node } = useCore();

  const postsRef = get364node('posts', false, userId);

  // my own reactions node
  const reactionsRef = get364node('reactions');
  // my own feedindex node
  const feedIndexRef = get364node('feedPostsByDate');

  useEffect(() => {
    let unsubscribe: any;
    const startIndexing = async () => {
      unsubscribe = await indexUser(postsRef, userId, feedIndexRef);
    };

    if (userId) {
      startIndexing();
    }

    return () => unsubscribe && unsubscribe.off();
  }, [feedIndexRef, postsRef, userId]);

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
