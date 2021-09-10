import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@altrx/gundb-react-auth';
import { MyProfile } from '../components/MyProfile';
import { PublicProfile } from '../components/PublicProfile';

export const ProfileView: React.FC = () => {
  const { userId } = useParams();
  const { appKeys } = useAuth();
  const isOwnProfile = appKeys && appKeys.pub && userId === appKeys.pub;

  const View = isOwnProfile ? MyProfile : PublicProfile;

  return (
    <div className="main" id="">
      <View />
    </div>
  );
};
