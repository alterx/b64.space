import React, { useEffect } from 'react';
import { useGunCollectionState, useGunState } from '@altrx/gundb-react-hooks';
import { useCore } from '../context/coreContext';
import { Profile, Post } from '../utils/types';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/styles';
import { useParams } from 'react-router-dom';
import { indexUser, indexPost, useFetchPosts } from '../utils/feed';

import ProfileHeader from './ProfileHeader';
import Compose from './Compose';
import { MessageList } from './MessageList';

const useStyles = makeStyles({
  container: {
    position: 'relative',
  },
});

export const MyProfile: React.FC = () => {
  const { /*useMyInbox,*/ get364node } = useCore();
  const classes = useStyles();
  const { userId } = useParams();

  const profileRef = get364node('profile');
  const postsRef = get364node('posts');
  const postsIndexRef = get364node('postsByDate');
  const feedIndexRef = get364node('feedPostsByDate');
  // const notificationsRef = get364node('notifications');

  const { addToSet: addToIndex } = useGunCollectionState<any>(postsIndexRef);
  const { fields: profile, put } = useGunState<Profile>(profileRef);
  const { addToSet } = useGunCollectionState<Post>(postsRef);
  const { pub } = profile;

  const [posts, fetchPosts] = useFetchPosts(pub || userId);

  // const [notifications] = useMyInbox(postsRef, notificationsRef);

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

  useEffect(() => {
    if (!posts.length) {
      fetchPosts(pub || userId);
    }
  }, [fetchPosts, posts, pub, userId]);

  const onAddPostHandler = async ({ content, createdAt }: Post) => {
    await addToSet({ content, createdAt, name: pub || userId }, createdAt);
    await addToIndex({ nodeID: createdAt }, createdAt);
    indexPost({
      date: createdAt,
      pub: pub || userId,
    });
  };

  const onUpdateProfileHandler = ({ name, bio }: Profile) => {
    put({ name, bio });
  };

  return (
    <Container className={classes.container}>
      <ProfileHeader profile={profile} onName={onUpdateProfileHandler} />
      <br />
      <Compose onPost={onAddPostHandler} />
      <br />
      <MessageList
        posts={posts}
        theirKeys={{ pub: pub || userId }}
        keys={{ pub: pub || userId }}
      />
    </Container>
  );
};
