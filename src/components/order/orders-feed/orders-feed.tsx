import { Link, useLocation } from 'react-router-dom';

import { OrdersFeedItem } from './orders-feed-item/orders-feed-item';

import type { TFindOrder } from '@/api/types';

import styles from './orders-feed.module.css';

type OrdersFeedProps = {
  orders: TFindOrder[];
  withStatus?: boolean;
};

export const OrdersFeed = ({
  orders,
  withStatus,
}: OrdersFeedProps): React.JSX.Element => {
  const location = useLocation();

  return (
    <section className={styles.orders_feed}>
      {orders?.map((order) => (
        <Link
          style={{ textDecoration: 'none', color: 'inherit' }}
          key={order.number}
          to={`${location.pathname}/${order.number}`}
          state={{ backgroundLocation: location }}
        >
          <OrdersFeedItem key={order._id} orderInfo={order} withStatus={withStatus} />
        </Link>
      ))}
    </section>
  );
};
