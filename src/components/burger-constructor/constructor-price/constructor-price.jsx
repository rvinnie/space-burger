import { CurrencyIcon, Button } from '@krgaa/react-developer-burger-ui-components';

import styles from './constructor-price.module.css';

export const ConstructorPrice = ({ price, onModalOpen }) => {
  return (
    <section className={`${styles.price_container} pt-10 pb-10`}>
      <div className={`${styles.price}`}>
        <p className="text text_type_digits-medium">{price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <Button onClick={onModalOpen} size="medium" type="primary">
        Оформить заказ
      </Button>
    </section>
  );
};
