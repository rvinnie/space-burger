import styles from './additional-action-container.module.css';

type AdditionalActionContainerProps = {
  children?: React.ReactNode;
};

export const AdditionalActionContainer = ({
  children,
}: AdditionalActionContainerProps): React.JSX.Element => {
  return <div className={styles.additional_action_container}>{children}</div>;
};
