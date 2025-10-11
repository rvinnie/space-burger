import styles from './registration-container.module.css';

export const RegistrationContainer = ({ onSubmit, children }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(e);
    }
  };

  return (
    <form className={styles.registration_container} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
