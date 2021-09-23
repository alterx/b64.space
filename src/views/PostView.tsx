import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@altrx/gundb-react-auth';
import { useGunState } from '@altrx/gundb-react-hooks';
import Message from '../components/Message';
import { useCore } from '../context/coreContext';
import { Profile } from '../utils/types';
import Grid from '@mui/material/Grid';

export const PostView: React.FC = () => {
  const { userId, postId } = useParams<any>();
  const { appKeys } = useAuth();
  const { get364node } = useCore();
  const isOwnProfile = appKeys && appKeys.pub && userId === appKeys.pub;

  const profileRef = get364node('profile', isOwnProfile, userId);
  const { fields: profile } = useGunState<Profile>(profileRef);
  const { epub, pub, inbox } = profile;

  // my reactions
  const reactionsRef = get364node('reactions');
  const postsRef = get364node('posts', isOwnProfile, userId);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Message
          nodeID={postId}
          reactionsRef={reactionsRef}
          postsRef={postsRef}
          theirKeys={{ pub, epub }}
          inbox={inbox}
          keys={appKeys}
        />
      </Grid>
    </Grid>
  );
};
