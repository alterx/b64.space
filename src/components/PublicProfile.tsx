import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGunState } from '@altrx/gundb-react-hooks';
import { indexUser, useFetchPosts } from '../utils/feed';
import { useAuth } from '@altrx/gundb-react-auth';
import { useCore } from '../context/coreContext';
import { Profile } from '../utils/types';
import { MessageList } from './MessageList';

export const PublicProfile: React.FC = () => {
  const { userId } = useParams();
  const { appKeys: myKeys } = useAuth();

  const [posts, fetchPosts] = useFetchPosts(userId);
  const { get364node } = useCore();

  const profileRef = get364node('profile', false, userId);
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

  useEffect(() => {
    if (!posts.length) {
      fetchPosts(userId);
    }
  }, [fetchPosts, posts, userId]);

  const { fields: publicUserProfile } = useGunState<Profile>(profileRef);
  const { name, epub, pub, inbox } = publicUserProfile;

  return (
    <div className="main" id="">
      <h1>This is {name}</h1>
      <br />
      <MessageList
        posts={posts}
        reactionsRef={reactionsRef}
        epub={epub}
        pub={pub || userId}
        inbox={inbox}
        theirKeys={{ epub, pub }}
        keys={myKeys}
      />
    </div>
  );
};
