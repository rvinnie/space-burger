import { BASE_WS_URL } from '@/api/types';
import { OrdersFeed } from '@/components/order/orders-feed/orders-feed';
import { useEnrichedOrders } from '@/hooks/use-enrich-orders';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  getProfileOrders,
  getProfileOrdersError,
  getProfileOrdersIsConnecting,
} from '@/services/profile-orders';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ordersResp = useSelector(getProfileOrders);
  const ordersIsConnecting = useSelector(getProfileOrdersIsConnecting);
  const ordersError = useSelector(getProfileOrdersError);

  const accessToken = localStorage.getItem('accessToken')?.replace('Bearer ', '');

  const enrichedOrders = useEnrichedOrders(ordersResp?.orders || null);

  useEffect(() => {
    dispatch(connectProfileOrders(`${BASE_WS_URL}?token=${accessToken}`));

    return (): void => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch]);

  if (ordersError) {
    return (
      <div className="text text_type_main-medium mt-5">
        Ошибка загрузки заказов: {ordersError}
      </div>
    );
  }

  if (ordersIsConnecting) {
    return (
      <div className={`${styles.preloader}`}>
        <Preloader />
      </div>
    );
  }

  if (!ordersResp) {
    return <></>;
  }

  return (
    <section className={`${styles.orders} mt-10 mb-10 pr-2`}>
      <OrdersFeed orders={enrichedOrders || []} withStatus />
    </section>
  );
};
