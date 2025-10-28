import styles from './profile-container.module.css';

export const ProfileContainer = ({ children }) => {
  return <div className={styles.profile_container}>{children}</div>;
};
