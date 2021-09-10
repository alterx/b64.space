import { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { Profile } from '../utils/types';

export default function ProfileHeader({
  profile,
  onName,
}: {
  profile: Profile;
  onName: (profile: Partial<Profile>) => void;
}) {
  const [newName, setNewName] = useState(profile?.name);
  const [newBio, setNewBio] = useState(profile?.bio);

  useEffect(() => {
    setNewName(profile?.name || '');
    setNewBio(profile?.bio || '');
  }, [profile]);
  const [edit, setEdit] = useState(false);
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
        alt="green iguana"
      />
      <CardContent>
        {!edit && (
          <>
            <Typography gutterBottom variant="h5" component="div">
              {profile?.name || 'Add your name'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {profile?.bio || 'Add a cool bio'}
            </Typography>
          </>
        )}
        {edit && (
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
          </>
        )}
      </CardContent>
      <CardActions>
        {edit && (
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
        {!edit && (
          <Button
            size="small"
            onClick={() => {
              setEdit(true);
            }}
          >
            Edit Profile
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
