import { Feed } from '@/pages/feed/feed';
import { ForgotPassword } from '@/pages/forgot-password/forgot-password';
import { Home } from '@/pages/home/home';
import { Login } from '@/pages/login/login';
import { ProfileAccount } from '@/pages/profile-account/profile-account';
import { ProfileOrders } from '@/pages/profile-orders/profile-orders';
import { Profile } from '@/pages/profile/profile';
import { Register } from '@/pages/register/register';
import { ResetPassword } from '@/pages/reset-password/reset-password';
import { loadUser } from '@/services/user';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  loadIngredients,
} from '@services/burger-ingredients';

import { IngredientDetailsWrapper } from '../burger-ingredients/ingredient-details-wrapper/ingredient-details-wrapper';
import { IngredientDetails } from '../burger-ingredients/ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { ProtectedRoute } from '../protected-route/protected-route';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();
  let location = useLocation();

  const ingredients = useSelector(getIngredients);
  const ingredientsLoading = useSelector(getIngredientsLoading);
  const ingredientsError = useSelector(getIngredientsError);
  let state = location.state;

  useEffect(() => {
    dispatch(loadIngredients());
    dispatch(loadUser());
  }, []);

  const errComponent = (
    <div className="text_type_main-medium mt-5">Произошла ошибка загрузки данных...</div>
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={`${styles.main} pl-5 pr-5`}>
        {ingredientsLoading ? (
          <Preloader />
        ) : ingredientsError ? (
          errComponent
        ) : ingredients && ingredients.data && ingredients.data.length > 0 ? (
          <>
            <Routes location={state?.backgroundLocation || location}>
              <Route
                path="ingredients/:id"
                element={
                  <IngredientDetailsWrapper>
                    <IngredientDetails />
                  </IngredientDetailsWrapper>
                }
              />
              <Route
                path="login"
                element={
                  <ProtectedRoute onlyUnAuth>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path="register"
                element={
                  <ProtectedRoute onlyUnAuth>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reset-password"
                element={
                  <ProtectedRoute onlyUnAuth>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="forgot-password"
                element={
                  <ProtectedRoute onlyUnAuth>
                    <ForgotPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <ProfileAccount />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute>
                      <ProfileOrders />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="feed"
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Home />} />
            </Routes>

            {state?.backgroundLocation && (
              <Routes>
                <Route
                  path="/ingredients/:id"
                  element={
                    <Modal header={'Детали ингредиента'}>
                      <IngredientDetails />
                    </Modal>
                  }
                />
              </Routes>
            )}
          </>
        ) : (
          errComponent
        )}
      </main>
    </div>
  );
};
