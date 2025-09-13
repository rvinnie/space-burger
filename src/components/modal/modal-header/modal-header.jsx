import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './modal-header.module.css';

export const ModalHeader = ({ children, onClose }) => {
  return (
    <div className={`${styles.modal_header} text text_type_main-large`}>
      <button className={styles.modal_button}>
        <CloseIcon onClick={onClose} type="primary" />
      </button>
      {children}
    </div>
  );
};
