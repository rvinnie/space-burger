import { CurrencyIcon, Button } from '@krgaa/react-developer-burger-ui-components';

import styles from './constructor-price.module.css';

type ConstructorPriceProps = {
  price: number;
  onModalOpen: () => void;
  isDisabled: boolean;
};

export const ConstructorPrice = ({
  price,
  onModalOpen,
  isDisabled,
}: ConstructorPriceProps): React.JSX.Element => {
  return (
    <section className={`${styles.price_container} pt-10 pb-10`}>
      <div className={`${styles.price}`}>
        <p className="text text_type_digits-medium">{price}</p>
        <CurrencyIcon type="primary" />
      </div>

      <Button
        disabled={isDisabled}
        onClick={onModalOpen}
        size="medium"
        type="primary"
        htmlType={'button'}
      >
        Оформить заказ
      </Button>
    </section>
  );
};
