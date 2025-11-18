import { AdditionalActionContainer } from '@/components/registration/additional-action-container/additional-action-container';
import { RegistrationContainer } from '@/components/registration/registration-container/registration-container';
import { useDispatch, useSelector } from '@/services/store';
import { getLoginError, login } from '@/services/user';
import { Button, EmailInput, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import styles from './login.module.css';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowPassword, setIsShowPassword] = useState<boolean>(true);

  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  const loginError = useSelector(getLoginError);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = async (): Promise<void> => {
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate(from.pathname, { replace: true });
    } catch {
      // Ошибка обрабатывается через loginError
    }
  };

  const isEnabled = email.length !== 0 && password.length !== 0;

  return (
    <RegistrationContainer onSubmit={handleLoginClick}>
      <h1 className={`text text_type_main-medium mb-6`}>Вход</h1>
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
      <Input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type={isShowPassword ? 'password' : 'text'}
        placeholder="Пароль"
        icon={isShowPassword ? 'ShowIcon' : 'HideIcon'}
        size="default"
        errorText=""
        name="password"
        onIconClick={() => {
          setIsShowPassword(!isShowPassword);
        }}
        extraClass="mb-6"
      />
      <Button
        htmlType="submit"
        size="medium"
        type="primary"
        disabled={!isEnabled}
        extraClass="mb-20"
      >
        Войти
      </Button>
      <AdditionalActionContainer>
        <div className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?
        </div>
        <Link
          className={`${styles.additional_actions_link} ml-2 text text_type_main-default`}
          key="register"
          to="/register"
        >
          Зарегистрироваться
        </Link>
      </AdditionalActionContainer>
      <div className="mb-4" />
      <AdditionalActionContainer>
        <div className="text text_type_main-default text_color_inactive">
          Забыли пароль?
        </div>
        <Link
          className={`${styles.additional_actions_link} ml-2 mb-4 text text_type_main-default`}
          key="forgot-password"
          to="/forgot-password"
        >
          Восстановите пароль
        </Link>
      </AdditionalActionContainer>
      {loginError && (
        <div className={`${styles.form_error} text_type_main-default`}>
          Произошла ошибка ({loginError})
        </div>
      )}
    </RegistrationContainer>
  );
};
