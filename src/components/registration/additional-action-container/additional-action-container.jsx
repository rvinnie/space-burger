import styles from './additional-action-container.module.css';

export const AdditionalActionContainer = ({ children }) => {
  return <div className={styles.additional_action_container}>{children}</div>;
};
