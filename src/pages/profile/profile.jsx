import { ProfileContainer } from '@/components/profile/profile-container/profile-container';
import { ProfileMenu } from '@/components/profile/profile-menu/profile-menu';
import { Outlet } from 'react-router-dom';

import styles from './profile.module.css';

export const Profile = () => {
  return (
    <ProfileContainer>
      <ProfileMenu />
      <div className={styles.profile_content}>
        <Outlet />
      </div>
    </ProfileContainer>
  );
};
