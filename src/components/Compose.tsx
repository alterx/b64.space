import { useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Post } from '../utils/types';
import { useCore } from '../context/coreContext';
import { useGunCollectionState } from '@altrx/gundb-react-hooks';
import { styled } from '@mui/material/styles';

const PREFIX = 'Compose';

const classes = {
  root: `${PREFIX}-root`,
  textarea: `${PREFIX}-textarea`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.root}`]: {
    width: '100%',
    paddding: 0,
  },
  [`& .${classes.textarea}`]: {
    width: '100%',
    padding: theme.spacing(1),
    minHeight: '80px',
  },
}));

export default function Compose({
  pub,
  isMain,
}: {
  pub: string;
  isMain?: boolean;
}) {
  const { get364node, indexPost, setUpdateFeed } = useCore();
  const postsRef = get364node('posts');
  const postsIndexRef = get364node('postsByDate');
  const { addToSet: addToIndex } = useGunCollectionState<any>(postsIndexRef);
  const { addToSet } = useGunCollectionState<Post>(postsRef);
  const [post, setPost] = useState('');
  const onAddPostHandler = async (item: Post) => {
    await addToSet(item, item.createdAt);
    await addToIndex({ nodeID: item.createdAt }, item.createdAt);
    await indexPost([
      {
        date: item.createdAt,
        pub,
      },
    ]);
    setUpdateFeed(true);
  };

  return (
    <Grid item xs={12}>
      <StyledBox>
        <TextareaAutosize
          className={classes.textarea}
          maxRows={4}
          aria-label="maximum height"
          value={post}
          onChange={(e) => {
            setPost(e.target.value);
          }}
          placeholder={'Write something...'}
        />
        <Button
          onClick={async () => {
            if (post) {
              const date = new Date().toISOString();
              onAddPostHandler({ content: post, createdAt: date, name: pub });
              setPost('');
            }
          }}
        >
          Post it
        </Button>
      </StyledBox>
    </Grid>
  );
}
