import { resetPasswordAPI } from '@/api/space-api';
import { AdditionalActionContainer } from '@/components/registration/additional-action-container/additional-action-container';
import { RegistrationContainer } from '@/components/registration/registration-container/registration-container';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './reset-password.module.css';

export const ResetPassword = (): React.JSX.Element => {
  const [code, setCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowPassword, setIsShowPassword] = useState<boolean>(true);

  const [saveError, setSaveError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleRestoreButton = (): void => {
    setSaveError(null);

    resetPasswordAPI({ password, token: code })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => {
        setSaveError(err?.response?.data?.message || 'Unknown error occurred');
      });
  };

  const isEnabled = code.length !== 0 && password.length !== 0;

  return (
    <RegistrationContainer>
      <h1 className={`text text_type_main-medium mb-6`}>Восстановление пароля</h1>
      <Input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type={isShowPassword ? 'password' : 'text'}
        placeholder="Введите новый пароль"
        icon={isShowPassword ? 'ShowIcon' : 'HideIcon'}
        size="default"
        errorText=""
        name="password"
        onIconClick={() => {
          setIsShowPassword(!isShowPassword);
        }}
        extraClass="mb-6"
      />
      <Input
        name="code"
        onChange={(e) => {
          setCode(e.target.value);
        }}
        placeholder="Введите код из письма"
        size="default"
        type="text"
        errorText=""
        value={code}
        extraClass="mb-6"
      />
      <Button
        onClick={() => handleRestoreButton()}
        size="medium"
        type="primary"
        extraClass="mb-20"
        disabled={!isEnabled}
        htmlType={'button'}
      >
        Сохранить
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
      {saveError && (
        <div className={`${styles.form_error} text_type_main-default`}>
          Произошла ошибка ({saveError}){' '}
        </div>
      )}
    </RegistrationContainer>
  );
};
