import { memo, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useCore } from '../context/coreContext';
import { MessageListProps } from '../utils/types';
import {
  useGunOnNodeUpdated,
  debouncedUpdates,
} from '@altrx/gundb-react-hooks';
import { Message } from './Message';
import VirtualList from './VirtualList';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { red } from '@mui/material/colors';
import { useAuth } from '@altrx/gundb-react-auth';

const PREFIX = 'MessageList';

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  avatar: `${PREFIX}-avatar`,
};

const StyledList = styled(Box)(({ theme }) => ({
  [`& .${classes.root}`]: {
    width: '100%',
  },

  [`& .${classes.card}`]: {
    padding: '12px',
  },

  [`& .${classes.avatar}`]: {
    backgroundColor: red[500],
  },
}));

export const MessageList = ({
  reactionsRef,
  filter,
  keys,
  theirKeys,
  inbox,
  name = 'posts',
}: MessageListProps) => {
  const { get364node, usePagination } = useCore();
  let postsRef: any;
  const { pub: myPub } = keys;
  const { appKeys } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    reset,
  ] = usePagination(filter);

  const postsIndexRef = get364node('postsByDate');
  const updater = useRef(
    debouncedUpdates(
      () => {
        reset();
      },
      'object',
      1000
    )
  );

  useGunOnNodeUpdated(postsIndexRef.map(), { appKeys }, (update: any) => {
    updater?.current(update);
  });

  const renderRow = ({ date, pub: ipub }: { date: string; pub: string }) => {
    const myMessage = myPub === ipub;
    if (myMessage) {
      postsRef = get364node(name);
    } else {
      postsRef = get364node(name, false, ipub);
    }

    if (!date) {
      return null;
    }

    return (
      <>
        {myMessage ? (
          <Message nodeID={date} postsRef={postsRef} keys={keys} />
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
      </>
    );
  };

  return (
    <Grid item xs={12}>
      <StyledList>
        <VirtualList
          items={data}
          renderRow={renderRow}
          fetchMore={fetchNextPage}
          isLoading={isFetchingNextPage}
          isLoadingData={isFetching}
          hasNextPage={hasNextPage}
        />
      </StyledList>
    </Grid>
  );
};

export default memo(MessageList);
