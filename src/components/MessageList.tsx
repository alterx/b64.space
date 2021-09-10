import React from 'react';
import { useCore } from '../context/coreContext';
import { MessageListProps } from '../utils/types';
import { Message } from './Message';

import { makeStyles, createStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    card: {
      padding: '12px',
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);

export const MessageList = ({
  reactionsRef,
  posts,
  keys,
  theirKeys,
  inbox,
  name = 'posts',
}: MessageListProps) => {
  const { get364node } = useCore();
  let postsRef: any;
  const { pub: myPub } = keys;
  const classes = useStyles();

  return (
    <List>
      {posts?.map(({ date, pub: ipub }: { date: string; pub: string }) => {
        const myMessage = myPub === ipub;
        if (myMessage) {
          postsRef = get364node(name);
        } else {
          postsRef = get364node(name, false, ipub);
        }
        const key = date + ipub;
        return (
          <ListItem key={key}>
            {myMessage ? (
              <Message nodeID={date} postsRef={postsRef} />
            ) : (
              <Message
                nodeID={date}
                reactionsRef={reactionsRef}
                postsRef={postsRef}
                theirKeys={theirKeys}
                inbox={inbox}
                keys={keys}
              />
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

export default React.memo(MessageList);
