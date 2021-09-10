import React from 'react';
import { useGunState } from '@altrx/gundb-react-hooks';
import { useCore } from '../context/coreContext';
import { MessageProps } from '../utils/types';

import { makeStyles, createStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    card: {
      padding: 5,
      border: '1px solid  ',
      margin: 0,
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);

export const Message = ({
  nodeID,
  reactionsRef,
  postsRef,
  keys,
  theirKeys = {},
  inbox,
}: MessageProps) => {
  const classes = useStyles();
  const { sendToInbox } = useCore();
  const { fields = {} } = useGunState<any>(postsRef.get(nodeID));
  const { fields: likes = {} } = useGunState<any>(
    postsRef.get(nodeID).get('likes')
  );

  const isReady = Object.keys(fields).length > 0;
  const name = fields?.name ? fields.name : 'Anonymous';
  const { pub, epub } = theirKeys;

  return (
    <>
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
                name
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
                      if (likes) {
                        return !!likes[a];
                      }
                    }).length
                  }
                  {!likes || (likes && !likes[keys?.pub]) ? (
                    <FavoriteBorderIcon />
                  ) : (
                    <FavoriteIcon />
                  )}
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </>
            )}
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default React.memo(Message);
