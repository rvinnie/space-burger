import { getUser, updateUser } from '@/services/user';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './profile-account.module.css';

export const ProfileAccount = () => {
  const user = useSelector(getUser);

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState('');
  const [isNameDisabled, setIsNameDisabled] = useState(true);
  const [isEmailDisabled, setIsEmailDisabled] = useState(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const dispatch = useDispatch();

  const handleSaveClick = (e) => {
    e.preventDefault();

    dispatch(updateUser({ name, email, password }));
    setIsEmailDisabled(true);
    setIsNameDisabled(true);
    setIsPasswordDisabled(true);
  };

  const handleCancelClick = () => {
    setName(user?.name);
    setEmail(user?.email);
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
          setTimeout(() => nameRef.current.focus(), 0);
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
          setTimeout(() => emailRef.current.focus(), 0);
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
          setTimeout(() => passwordRef.current.focus(), 0);
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
          <Button size="medium" type="secondary" onClick={() => handleCancelClick()}>
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
