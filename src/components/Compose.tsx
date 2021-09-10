import { useState } from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';

export default function Compose({ onPost }) {
  const [post, setPost] = useState('');

  return (
    <>
      <TextareaAutosize
        maxRows={4}
        aria-label="maximum height"
        value={post}
        onChange={(e) => {
          setPost(e.target.value);
        }}
        placeholder={'Write something...'}
        style={{ width: 200 }}
      />
      <Button
        onClick={async () => {
          if (post) {
            const date = new Date().toISOString();
            onPost({ content: post, createdAt: date });
            setPost('');
          }
        }}
      >
        Post it
      </Button>
    </>
  );
}
