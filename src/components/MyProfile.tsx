import React, { useEffect } from 'react';
import { useCore } from '../context/coreContext';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import { indexUser } from '../utils/feed';

import Compose from './Compose';
import { MessageList } from './MessageList';

export const MyProfile: React.FC<{ profile: any }> = ({ profile }) => {
  const { get364node } = useCore();

  const { userId } = useParams();
  const postsRef = get364node('posts');
  const feedIndexRef = get364node('feedPostsByDate');
  const { pub } = profile;

  useEffect(() => {
    let unsubscribe: any;
    const startIndexing = async () => {
      unsubscribe = await indexUser(postsRef, pub || userId, feedIndexRef);
    };

    if (pub || userId) {
      startIndexing();
    }

    return () => unsubscribe && unsubscribe.off();
  }, [postsRef, pub, userId, feedIndexRef]);

  return (
    <Grid container spacing={3}>
      <Compose pub={pub || userId} />

      <MessageList
        filter={pub || userId}
        theirKeys={{ pub: pub || userId }}
        keys={{ pub: pub || userId }}
      />
    </Grid>
  );
};
