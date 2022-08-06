import { memo } from 'react';
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
import { red, blueGrey } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';

import formatRelative from 'date-fns/formatRelative';

const PREFIX = 'Message';

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  avatar: `${PREFIX}-avatar`,
  name: `${PREFIX}-name`,
  message: `${PREFIX}-message`,
  date: `${PREFIX}-date`,
  cardHeader: `${PREFIX}-cardHeader`,
  cardContent: `${PREFIX}-cardContent`,
  cardActions: `${PREFIX}-cardActions`,
};

const Root = styled(Box)(({ theme }) => ({
  [`& .${classes.root}`]: {
    width: '100%',
    minHeight: 121,
  },
  [`& .${classes.card}`]: {
    border: `1px solid ${blueGrey[300]}`,
    borderTop: 'none',
    maxWidth: '100%',
    margin: 0,
    minHeight: 121,
    borderRadius: 0,
    padding: theme.spacing(2),
  },
  [`& .${classes.cardHeader}`]: {
    paddingBottom: 0,
    paddingTop: 0,
    alignSelf: 'flex-start',
  },
  [`& .${classes.cardContent}`]: {
    paddingBottom: 0,
    paddingTop: 0,

    alignSelf: 'flex-start',
  },
  [`& .${classes.cardActions}`]: {
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: theme.spacing(9),
  },
  [`& .${classes.avatar}`]: {
    backgroundColor: red[500],
  },
  [`& .${classes.name}`]: {
    textDecoration: 'none',
    color: 'white',
    fontSize: 14,
  },
  [`& .${classes.date}`]: {
    textDecoration: 'none',
    color: blueGrey[300],
    fontSize: 11,
  },
  [`& .${classes.message}`]: {
    textDecoration: 'none',
    color: 'white',
    fontSize: 12,
    // fontFamily: 'Roboto',
    paddingLeft: theme.spacing(7),
  },
}));

const Name = ({ pub, createdAt }: { pub: string; createdAt: string }) => {
  const { get364node } = useCore();
  const profileRef = get364node('profile', false, pub);
  const { fields: profile } = useGunState<Profile>(profileRef);
  return (
    <>
      <Typography variant="h6">
        <Link className={classes.name} to={`/profile/${pub}`}>
          {profile?.name ? profile.name : ''}
        </Link>

        <Typography
          variant="subtitle1"
          className={classes.date}
          component="span"
        >
          {` - ${formatRelative(new Date(createdAt), new Date())}`}
        </Typography>
      </Typography>
    </>
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
  const likeCount = Object.keys(likes || {}).filter((a) => {
    return !!likes[a] && typeof likes[a] === 'boolean';
  }).length;

  const isReady = Object.keys(fields).length > 0;
  const name = fields?.name ? fields.name : 'Anonymous';
  const { pub, epub } = theirKeys;

  const handleCopyText = () => {
    const cb = navigator.clipboard;
    cb.writeText(`http://localhost:3000/profile/${keys?.pub || pub}/${nodeID}`);
  };

  return (
    <Root style={{ width: '100%', minHeight: 121 }} padding={0}>
      <Box className={classes.root}>
        <Card className={classes.card} elevation={0}>
          <CardHeader
            className={classes.cardHeader}
            classes={{
              content: classes.cardContent,
            }}
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
                <Name pub={name} createdAt={fields?.createdAt} />
              )
            }
          />
          <CardContent className={classes.cardContent}>
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
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.message}
              >
                {fields?.content}
              </Typography>
            )}
          </CardContent>
          <CardActions disableSpacing className={classes.cardActions}>
            {!isReady ? null : (
              <>
                <IconButton
                  style={{ padding: 0, fontSize: 14 }}
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
                  {likeCount}
                  {!likes || (likes && !likes[keys?.pub]) ? (
                    <FavoriteBorderIcon fontSize="small" />
                  ) : (
                    <FavoriteIcon fontSize="small" />
                  )}
                </IconButton>
                <IconButton
                  style={{ padding: 0, marginLeft: 6, fontSize: 12 }}
                  aria-label="share"
                  onClick={handleCopyText}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </CardActions>
        </Card>
      </Box>
    </Root>
  );
};
export default memo(Message);
