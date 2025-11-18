import { useDispatch } from '@/services/store';
import { logout } from '@/services/user';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './profile-menu.module.css';

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = (): void => {
    dispatch(logout());
  };

  const getInfoText = (): string => {
    switch (location.pathname) {
      case '/profile':
        return 'В этом разделе вы можете изменить свои персональные данные';
      case '/profile/orders':
        return 'В этом разделе вы можете просмотреть свою историю заказов';
      default:
        return 'В этом разделе вы можете изменить свои персональные данные';
    }
  };

  return (
    <nav className={styles.nav_container}>
      <NavLink
        to={'/profile'}
        end
        className={({ isActive }) =>
          `${isActive ? styles.link_active : ''} ${styles.link} text text_type_main-medium`
        }
      >
        Профиль
      </NavLink>
      <NavLink
        to={'/profile/orders'}
        className={({ isActive }) =>
          `${isActive ? styles.link_active : ''} ${styles.link} mt-9 text text_type_main-medium`
        }
      >
        История заказов
      </NavLink>
      <button
        onClick={() => handleLogout()}
        className={`${styles.button} text text_type_main-medium mt-9 mb-20`}
      >
        Выход
      </button>
      <p className="text text_type_main-default text_color_inactive">{getInfoText()}</p>
    </nav>
  );
};
