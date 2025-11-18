import { forgotPasswordAPI } from '@/api/space-api';
import { AdditionalActionContainer } from '@/components/registration/additional-action-container/additional-action-container';
import { RegistrationContainer } from '@/components/registration/registration-container/registration-container';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './forgot-password.module.css';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [resetError, setResetError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRestoreButton = (): void => {
    setResetError(null);

    forgotPasswordAPI(email)
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => {
        setResetError(err?.response?.data?.message || 'Unknown error occurred');
      });
  };

  const isEnabled = email.length !== 0;

  return (
    <RegistrationContainer>
      <h1 className={`text text_type_main-medium mb-6`}>Восстановление пароля</h1>
      <EmailInput
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="E-mail"
        size="default"
        extraClass="mb-6"
        errorText=""
      />
      <Button
        onClick={() => handleRestoreButton()}
        size="medium"
        type="primary"
        extraClass="mb-20"
        disabled={!isEnabled}
        htmlType={'submit'}
      >
        Восстановить
      </Button>
      <AdditionalActionContainer>
        <div className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?
        </div>
        <Link
          className={`${styles.additional_actions_link} ml-2 mb-4 text text_type_main-default`}
          key="login"
          to="/login"
        >
          Войти
        </Link>
      </AdditionalActionContainer>
      {resetError && (
        <div className={`${styles.form_error} text_type_main-default`}>
          Произошла ошибка ({resetError})
        </div>
      )}
    </RegistrationContainer>
  );
};
