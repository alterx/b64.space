import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '@altrx/gundb-react-auth';
import { MessageList } from '../components/MessageList';
import { useFetchPosts } from '../utils/feed';

export const MainView: React.FC = () => {
  const { appKeys } = useAuth();
  const history = useHistory();

  const [posts, fetchPosts] = useFetchPosts();
  useEffect(() => {
    if (!posts.length) {
      fetchPosts();
    }
  }, [fetchPosts, posts]);

  return (
    <div className="main" id="">
      <h1>Welcome to 364</h1>
      <button
        onClick={() => {
          history.push(`/profile/${appKeys.pub}`);
        }}
      >
        My profile
      </button>
      <MessageList posts={posts} keys={appKeys} />
    </div>
  );
};
