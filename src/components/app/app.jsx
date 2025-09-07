import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import useApi from '@hooks/useApi';

import styles from './app.module.css';

const spaceApiUrl = 'https://norma.nomoreparties.space/api/ingredients';

export const App = () => {
  const { results, loading, error } = useApi(spaceApiUrl);
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
        {loading ? (
          <Preloader />
        ) : error ? (
          errComponent
        ) : results && results.data && results.data.length > 0 ? (
          <>
            <BurgerIngredients ingredients={results.data} />
            <BurgerConstructor ingredients={results.data} />
          </>
        ) : (
          errComponent
        )}
      </main>
    </div>
  );
};
