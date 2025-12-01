import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import orderAcceptedImage from '../../../assets/images/order-accepted.svg';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderNumber: number;
  isLoading: boolean;
  isError: boolean;
};

export const OrderDetails = ({
  orderNumber,
  isLoading,
  isError,
}: OrderDetailsProps): React.JSX.Element => {
  if (isLoading) {
    return (
      <div className={`${styles.order_preloader}`}>
        <Preloader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text text_type_main-medium mt-5">Ошибка загрузки заказа...</div>
    );
  }

  return (
    <section className={`${styles.order_details}`} data-cy="order-modal">
      <div className={`${styles.order_number} text text_type_digits-large mb-8`}>
        {orderNumber}
      </div>
      <div className="text text_type_main-medium mb-15">идентификатор заказа</div>
      <img src={orderAcceptedImage} className="mb-15" alt="Ваш заказ принят в работу" />
      <div className="text text_type_main-small mb-2">Ваш заказ начали готовить</div>
      <div className="text text_type_main-small text_color_inactive mb-20">
        Дождитесь готовности на орбитальной станции
      </div>
    </section>
  );
};
