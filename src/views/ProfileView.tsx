import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@altrx/gundb-react-auth';
import { useGunState } from '@altrx/gundb-react-hooks';
import { MyProfile } from '../components/MyProfile';
import { PublicProfile } from '../components/PublicProfile';
import ProfileHeader from '../components/ProfileHeader';
import { useCore } from '../context/coreContext';
import { Profile } from '../utils/types';
import { Typography } from '@mui/material';
import Compose from '../components/Compose';

export const ProfileView: FC = () => {
  const { userId = '' } = useParams<any>();
  const { appKeys } = useAuth();
  const { get364node, indexUser } = useCore();
  const isOwnProfile = appKeys && appKeys.pub && userId === appKeys.pub;

  const profileRef = get364node('profile', isOwnProfile, userId);
  const { fields: profile, put } = useGunState<Profile>(profileRef);

  // my followees
  const followeesRef = get364node('followees');
  const { fields: follows = {}, put: putFollowee } =
    useGunState<any>(followeesRef);

  const onUpdateProfileHandler = ({ name, bio, link }: Profile) => {
    put({ name, bio, link });
  };

  const onFollowHandler = async (toggleFollow: boolean) => {
    await putFollowee({ [userId]: !toggleFollow });
    indexUser(userId);
  };

  return (
    <>
      <ProfileHeader
        profile={profile}
        onName={onUpdateProfileHandler}
        isPublic={!isOwnProfile}
        followed={!!follows[userId]}
        showFollow={!isOwnProfile}
        onFollow={onFollowHandler}
      />
      {isOwnProfile ? (
        <>
          <Compose pub={appKeys.pub} />
          <MyProfile profile={profile} />
        </>
      ) : !!follows[userId] ? (
        <PublicProfile profile={profile} />
      ) : (
        <Typography
          variant="h5"
          style={{
            textAlign: 'center',
            width: '100%',
          }}
        >
          Follow this user to see their posts.
        </Typography>
      )}
    </>
  );
};
