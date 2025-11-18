import { useDispatch, useSelector } from '@/services/store';
import { getUser, updateUser } from '@/services/user';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';

import type { FormEvent } from 'react';

import styles from './profile-account.module.css';

export const ProfileAccount = (): React.JSX.Element => {
  const user = useSelector(getUser);

  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [password, setPassword] = useState<string>('');
  const [isNameDisabled, setIsNameDisabled] = useState<boolean>(true);
  const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState<boolean>(true);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const handleSaveClick = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    dispatch(updateUser({ name, email, password }));
    setIsEmailDisabled(true);
    setIsNameDisabled(true);
    setIsPasswordDisabled(true);
  };

  const handleCancelClick = (): void => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
    setIsEmailDisabled(true);
    setIsNameDisabled(true);
    setIsPasswordDisabled(true);
  };

  const isEnabled =
    name !== user?.name || email !== user?.email || password.length !== 0;

  return (
    <form className={styles.account_container} onSubmit={(e) => handleSaveClick(e)}>
      <Input
        ref={nameRef}
        name="name"
        errorText=""
        icon={isNameDisabled ? 'EditIcon' : 'CloseIcon'}
        onChange={(e) => {
          setName(e.target.value);
        }}
        onIconClick={() => {
          setIsNameDisabled(!isNameDisabled);
          setTimeout(() => nameRef.current?.focus(), 0);
        }}
        placeholder="Имя"
        size="default"
        type="text"
        disabled={isNameDisabled}
        value={name}
        extraClass="mb-6"
      />
      <Input
        ref={emailRef}
        name="email"
        errorText=""
        icon={isEmailDisabled ? 'EditIcon' : 'CloseIcon'}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        onIconClick={() => {
          setIsEmailDisabled(!isEmailDisabled);
          setTimeout(() => emailRef.current?.focus(), 0);
        }}
        placeholder="Логин"
        size="default"
        type="text"
        disabled={isEmailDisabled}
        value={email}
        extraClass="mb-6"
      />
      <Input
        ref={passwordRef}
        name="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        onIconClick={() => {
          setIsPasswordDisabled(!isPasswordDisabled);
          setTimeout(() => passwordRef.current?.focus(), 0);
        }}
        type={'password'}
        placeholder="Пароль"
        icon={isPasswordDisabled ? 'EditIcon' : 'CloseIcon'}
        size="default"
        errorText=""
        disabled={isPasswordDisabled}
        extraClass="mb-6"
      />
      {isEnabled && (
        <div className={styles.account_buttons}>
          <Button
            size="medium"
            type="secondary"
            onClick={() => handleCancelClick()}
            htmlType={'submit'}
          >
            Отмена
          </Button>
          <Button size="medium" type="primary" htmlType="submit">
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
