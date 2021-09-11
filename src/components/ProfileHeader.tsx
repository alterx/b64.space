import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { Profile } from '../utils/types';

export default function ProfileHeader({
  profile,
  onName,
  isPublic,
}: {
  profile: Profile;
  onName: (profile: Partial<Profile>) => void;
  isPublic: boolean;
}) {
  const [newName, setNewName] = useState(profile?.name);
  const [newBio, setNewBio] = useState(profile?.bio);
  const [newLink, setNewLink] = useState(profile?.link);

  useEffect(() => {
    setNewName(profile?.name || '');
    setNewBio(profile?.bio || '');
    setNewLink(profile?.link || '');
  }, [profile]);
  const [edit, setEdit] = useState(false);
  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey. ',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(https://source.unsplash.com/random)`,
      }}
    >
      {/* Increase the priority of the hero background image */}
      {
        <img
          style={{ display: 'none' }}
          src={'https://source.unsplash.com/random'}
          alt={'random image from unsplash'}
        />
      }
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <Typography
              component="h1"
              variant="h3"
              color="inherit"
              gutterBottom
            >
              {profile?.name}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              {profile?.bio}
            </Typography>
            <Link variant="subtitle1" href="carlosve.ga">
              carlosve.ga
            </Link>

            {edit && !isPublic && (
              <>
                <TextField
                  variant="outlined"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                  }}
                ></TextField>
                <TextField
                  variant="outlined"
                  multiline
                  value={newBio}
                  onChange={(e) => {
                    setNewBio(e.target.value);
                  }}
                ></TextField>
                <TextField
                  variant="outlined"
                  multiline
                  value={newLink}
                  onChange={(e) => {
                    setNewLink(e.target.value);
                  }}
                ></TextField>
              </>
            )}
            {edit && !isPublic && (
              <Button
                size="small"
                onClick={() => {
                  if (newName && newBio) {
                    onName({ name: newName, bio: newBio });
                    setEdit(false);
                  }
                }}
              >
                Update
              </Button>
            )}
            {!edit && !isPublic && (
              <Button
                size="small"
                onClick={() => {
                  setEdit(true);
                }}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
