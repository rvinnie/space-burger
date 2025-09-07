import styles from './modal-overlay.module.css';

export const ModalOverlay = ({ onClose }) => {
  return <div className={styles.modal_overlay} onClick={onClose} />;
};
