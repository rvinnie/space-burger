import { Home } from '@/pages/home/home';
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
  }, []);

  const errComponent = (
    <div className="text text_type_main-medium mt-5">
      Произошла ошибка загрузки данных...
    </div>
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
              <Route path="/" element={<Home />} />
              <Route
                path="/ingredients/:id"
                element={
                  <IngredientDetailsWrapper>
                    <IngredientDetails />
                  </IngredientDetailsWrapper>
                }
              />
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
