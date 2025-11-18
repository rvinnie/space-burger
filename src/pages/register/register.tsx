import { AdditionalActionContainer } from '@/components/registration/additional-action-container/additional-action-container';
import { RegistrationContainer } from '@/components/registration/registration-container/registration-container';
import { useDispatch, useSelector } from '@/services/store';
import { getRegisterError, register as registerAction } from '@/services/user';
import { Button, EmailInput, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './register.module.css';

export const Register = (): React.JSX.Element => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowPassword, setIsShowPassword] = useState<boolean>(true);

  const registerError = useSelector(getRegisterError);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEnabled = name.length !== 0 && email.length !== 0 && password.length !== 0;

  const handleRegisterClick = async (): Promise<void> => {
    try {
      await dispatch(registerAction({ name, email, password })).unwrap();
      navigate('/profile', { replace: true });
    } catch {
      // Ошибка обрабатывается через registerError
    }
  };
  return (
    <RegistrationContainer onSubmit={handleRegisterClick}>
      <h1 className={`text text_type_main-medium mb-6`}>Регистрация</h1>
      <Input
        name="name"
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="Имя"
        size="default"
        type="text"
        errorText=""
        value={name}
        extraClass="mb-6"
      />
      <EmailInput
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        errorText=""
        placeholder="E-mail"
        size="default"
        extraClass="mb-6"
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
        extraClass="mb-20"
        disabled={!isEnabled}
      >
        Зарегистрироваться
      </Button>
      <AdditionalActionContainer>
        <div className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?
        </div>

        <Link
          className={`${styles.additional_actions_link} ml-2 mb-4 text text_type_main-default`}
          key="login"
          to="/login"
        >
          Войти
        </Link>
      </AdditionalActionContainer>
      {registerError && (
        <div className={`${styles.form_error} text_type_main-default`}>
          Произошла ошибка ({registerError})
        </div>
      )}
    </RegistrationContainer>
  );
};
