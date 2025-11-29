import { OrdersPerColumns } from './orders-per-columns/orders-per-columns';

import styles from './orders-info.module.css';

type OrdersInfoProps = {
  total: number;
  totalToday: number;
  doneOrders: string[];
  createdOrders: string[];
};

export const OrdersInfo = ({
  total,
  totalToday,
  doneOrders,
  createdOrders,
}: OrdersInfoProps): React.JSX.Element => {
  return (
    <section className={`${styles.orders_info}`}>
      <div className={`${styles.columns_by_status}`}>
        <div className={styles.column}>
          <div className="text text_type_main-medium mb-6">Готовы:</div>
          <OrdersPerColumns orderNums={doneOrders} isDone />
        </div>
        <div className={styles.column}>
          <div className="text text_type_main-medium mb-6">В работе:</div>
          <OrdersPerColumns orderNums={createdOrders} />
        </div>
      </div>
      <div className="text text_type_main-medium mt-15">Выполнено за все время:</div>
      <div className={`${styles.digits_shadow} text_type_digits-large mb-15`}>
        {total}
      </div>
      <div className="text text_type_main-medium">Выполнено за сегодня:</div>
      <div className={`${styles.digits_shadow} text_type_digits-large`}>
        {totalToday}
      </div>
    </section>
  );
};
