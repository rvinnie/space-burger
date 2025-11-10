import styles from './registration-container.module.css';

type RegistrationContainerProps = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export const RegistrationContainer = ({
  onSubmit,
  children,
}: RegistrationContainerProps): React.JSX.Element => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form className={styles.registration_container} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
