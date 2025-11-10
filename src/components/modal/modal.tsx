import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import { ModalHeader } from '@components/modal/modal-header/modal-header';

import { ModalOverlay } from './modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('react-modals') as HTMLElement;

type ModalProps = {
  children: React.ReactNode;
  header?: string;
  onClose?: () => void;
};

export const Modal = ({ children, header, onClose }: ModalProps): React.JSX.Element => {
  const navigate = useNavigate();

  if (!onClose) {
    onClose = (): void | Promise<void> => navigate(-1);
  }

  useEffect(() => {
    const handleEscape = (e: { key: string }): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return (): void => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return createPortal(
    <>
      <div className={styles.modal}>
        <ModalHeader onClose={onClose}>{header}</ModalHeader>
        {children}
      </div>
      <ModalOverlay onClose={onClose} />
    </>,
    modalRoot
  );
};
