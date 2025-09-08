import orderAcceptedImage from '../../../assets/images/order-accepted.svg';

import styles from './order-details.module.css';

export const OrderDetails = ({ orderNumber }) => {
  return (
    <section className={`${styles.order_details}`}>
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
