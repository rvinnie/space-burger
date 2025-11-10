import styles from './profile-container.module.css';

type ProfileContainerProps = {
  children?: React.ReactNode;
};

export const ProfileContainer = ({
  children,
}: ProfileContainerProps): React.JSX.Element => {
  return <div className={styles.profile_container}>{children}</div>;
};
