import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  loadIngredients,
} from '@services/burger-ingredients';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();

  const ingredients = useSelector(getIngredients);
  const ingredientsLoading = useSelector(getIngredientsLoading);
  const ingredientsError = useSelector(getIngredientsError);

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
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        {ingredientsLoading ? (
          <Preloader />
        ) : ingredientsError ? (
          errComponent
        ) : ingredients && ingredients.data && ingredients.data.length > 0 ? (
          <DndProvider backend={HTML5Backend}>
            <BurgerIngredients ingredients={ingredients.data} />
            <BurgerConstructor />
          </DndProvider>
        ) : (
          errComponent
        )}
      </main>
    </div>
  );
};
