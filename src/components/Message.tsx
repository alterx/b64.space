import React from 'react';
import { styled } from '@mui/material/styles';
import { useGunState } from '@altrx/gundb-react-hooks';
import { useCore } from '../context/coreContext';
import { MessageProps, Profile } from '../utils/types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'Message';

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  avatar: `${PREFIX}-avatar`,
};

const Root = styled(Box)(({ theme }) => ({
  [`& .${classes.root}`]: {
    width: '100%',
    minHeight: 198,
  },
  [`& .${classes.card}`]: {
    border: '1px solid ',
    borderTop: 'none',
    maxWidth: '100%',
    margin: 0,
    minHeight: 198,
    borderRadius: 0,
  },
  [`& .${classes.avatar}`]: {
    backgroundColor: red[500],
  },
}));

const Name = ({ pub }: { pub: string }) => {
  const { get364node } = useCore();
  const profileRef = get364node('profile', false, pub);
  const { fields: profile } = useGunState<Profile>(profileRef);
  return (
    <Typography variant="h6">
      <Link to={`/profile/${pub}`}>{profile?.name ? profile.name : ''}</Link>
    </Typography>
  );
};

export const Message = ({
  nodeID,
  reactionsRef,
  postsRef,
  keys,
  theirKeys = {},
  inbox,
}: MessageProps) => {
  const { sendToInbox } = useCore();
  const { fields = {} } = useGunState<any>(postsRef.get(nodeID));
  const { fields: likes = {} } = useGunState<any>(
    postsRef.get(nodeID).get('likes')
  );

  const isReady = Object.keys(fields).length > 0;
  const name = fields?.name ? fields.name : 'Anonymous';
  const { pub, epub } = theirKeys;

  console.log(keys, theirKeys);

  const handleCopyText = () => {
    const cb = navigator.clipboard;
    cb.writeText(`http://localhost:3000/profile/${keys?.pub || pub}/${nodeID}`);
  };

  return (
    <Root style={{ width: '100%', minHeight: 198 }} padding={0}>
      <Box className={classes.root}>
        <Card className={classes.card} elevation={0}>
          <CardHeader
            avatar={
              !isReady ? (
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={40}
                  height={40}
                />
              ) : (
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {name[0].toLocaleUpperCase()}
                </Avatar>
              )
            }
            action={
              !isReady ? null : (
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              )
            }
            title={
              !isReady ? (
                <Skeleton
                  animation="wave"
                  height={10}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
              ) : (
                <Name pub={name} />
              )
            }
            subheader={
              !isReady ? (
                <Skeleton animation="wave" height={10} width="40%" />
              ) : (
                new Date(fields?.createdAt).toLocaleString()
              )
            }
          />
          <CardContent>
            {!isReady ? (
              <>
                <Skeleton
                  animation="wave"
                  height={10}
                  style={{ marginBottom: 6 }}
                />
                <Skeleton animation="wave" height={10} width="80%" />
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {fields?.content}
              </Typography>
            )}
          </CardContent>
          <CardActions disableSpacing>
            {!isReady ? null : (
              <>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => {
                    setTimeout(() => {
                      if (nodeID && pub && epub && inbox) {
                        sendToInbox(
                          {
                            type: 'reaction',
                            postId: nodeID,
                            reference: reactionsRef,
                            from: JSON.stringify({
                              pub: keys.pub,
                              epub: keys.epub,
                            }),
                            contents:
                              !likes || (likes && !likes[keys.pub])
                                ? 'like'
                                : 'dislike',
                          },
                          pub,
                          epub,
                          inbox
                        );
                      }
                    }, 0);
                  }}
                >
                  {
                    Object.keys(likes || {}).filter((a) => {
                      return !!likes[a];
                    }).length
                  }
                  {!likes || (likes && !likes[keys?.pub]) ? (
                    <FavoriteBorderIcon />
                  ) : (
                    <FavoriteIcon />
                  )}
                </IconButton>
                <IconButton aria-label="share" onClick={handleCopyText}>
                  <ShareIcon />
                </IconButton>
              </>
            )}
          </CardActions>
        </Card>
      </Box>
    </Root>
  );
};

export default React.memo(Message);
