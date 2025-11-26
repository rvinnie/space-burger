import { BASE_WS_URL } from '@/api/types';
import { OrdersFeed } from '@/components/order/orders-feed/orders-feed';
import { OrdersInfo } from '@/components/order/orders-info/orders-info';
import { useEnrichedOrders } from '@/hooks/use-enrich-orders';
import {
  connectFeed,
  disconnectFeed,
  getFeedError,
  getFeedIsConnecting,
  getFeedOrders,
} from '@/services/feed';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';

import styles from './feed.module.css';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ordersFeedResp = useSelector(getFeedOrders);
  const ordersFeedIsConnecting = useSelector(getFeedIsConnecting);
  const ordersFeedError = useSelector(getFeedError);

  const enrichedOrders = useEnrichedOrders(ordersFeedResp?.orders || null);

  const { doneOrders, createdOrders } = useMemo(() => {
    if (!enrichedOrders) {
      return { doneOrders: [], createdOrders: [] };
    }

    const done = enrichedOrders
      .filter((order) => order.status === 'done')
      .map((order) => order.number.toString().padStart(6, '0'));

    const created = enrichedOrders
      .filter((order) => order.status === 'created')
      .map((order) => order.number.toString().padStart(6, '0'));

    return { doneOrders: done, createdOrders: created };
  }, [enrichedOrders]);

  useEffect(() => {
    dispatch(connectFeed(`${BASE_WS_URL}/all`));

    return (): void => {
      dispatch(disconnectFeed());
    };
  }, [dispatch]);

  if (ordersFeedError) {
    return (
      <div className="text text_type_main-medium mt-5">
        Ошибка загрузки заказов: {ordersFeedError}
      </div>
    );
  }

  if (ordersFeedIsConnecting) {
    return (
      <div className={`${styles.preloader}`}>
        <Preloader />
      </div>
    );
  }

  if (!ordersFeedResp) {
    return <></>;
  }

  return (
    <section>
      <div className={`${styles.title} text_type_main-large mt-10 mb-5 pl-5`}>
        Лента заказов
      </div>
      <div className={`${styles.feed_with_info}`}>
        <div className={styles.orders_feed_container}>
          <OrdersFeed orders={enrichedOrders || []} />
        </div>
        <div className={styles.orders_info_container}>
          <OrdersInfo
            total={ordersFeedResp.total}
            totalToday={ordersFeedResp.totalToday}
            doneOrders={doneOrders}
            createdOrders={createdOrders}
          />
        </div>
      </div>
    </section>
  );
};
