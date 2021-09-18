import React from 'react';
import { useAuth } from '@altrx/gundb-react-auth';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const PREFIX = 'UnauthenticatedApp';

const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`,
  paper: `${PREFIX}-paper`,
  avatar: `${PREFIX}-avatar`,
  form: `${PREFIX}-form`,
  submit: `${PREFIX}-submit`,
};

const StyledGrid = styled(Grid)(({ theme }: any) => ({
  [`&.${classes.root}`]: {
    height: '100vh',
  },

  [`& .${classes.image}`]: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  [`& .${classes.paper}`]: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  [`& .${classes.form}`]: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        b36.space
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignInSide() {
  const { login } = useAuth();
  async function getApp(type: string, value?: string) {
    try {
      let keys;

      if (type === 'existing' && !value) return;

      if (type !== 'new') {
        if (typeof value === 'string') {
          keys = JSON.parse(value);
        } else {
          keys = value;
        }
      }

      login(keys);
    } catch (e) {}
  }

  return (
    <StyledGrid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="keys"
              label="Existing keys"
              name="keys"
              autoFocus
              onChange={(e) => {
                const { target } = e;
                getApp('existing', target.value);
              }}
              placeholder="Paste keys here"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="text"
              color="primary"
              className={classes.submit}
              onClick={() => {
                getApp('new');
              }}
            >
              Sign up
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </StyledGrid>
  );
}
