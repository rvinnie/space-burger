import { useEnrichedOrders } from '@/hooks/use-enrich-orders';
import { getFeedOrders } from '@/services/feed';
import {
  findOrder,
  getFindOrderDetailsError,
  getFindOrderDetailsLoading,
  getFoundOrderDetails,
} from '@/services/order-details';
import { getProfileOrders } from '@/services/profile-orders';
import { useDispatch, useSelector } from '@/services/store';
import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getStatusInfo } from '../utils/utils';
import { OrderInfoContents } from './order-info-contents/order-info-contents';

import styles from './order-info.module.css';

type OrderInfoProps = {
  centerHeader?: boolean;
};

export const OrderInfo = ({ centerHeader }: OrderInfoProps): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const feedOrders = useSelector(getFeedOrders);
  const profileOrders = useSelector(getProfileOrders);
  const foundOrder = useSelector(getFoundOrderDetails);
  const findLoading = useSelector(getFindOrderDetailsLoading);
  const findError = useSelector(getFindOrderDetailsError);

  const order = useMemo(() => {
    const orderFromFeed = feedOrders?.orders.find(
      (order) => order.number.toString() === id
    );
    const orderFromProfile = profileOrders?.orders.find(
      (order) => order.number.toString() === id
    );
    const orderFromApi = foundOrder?.orders?.[0];

    return orderFromFeed || orderFromProfile || orderFromApi;
  }, [id, feedOrders, profileOrders, foundOrder]);

  useEffect(() => {
    if (order) return;

    if (findLoading) return;

    if (!id) return;

    const hasOrderInLocalData =
      feedOrders?.orders.some((order) => order.number.toString() === id) ||
      profileOrders?.orders.some((order) => order.number.toString() === id);

    if (!hasOrderInLocalData) {
      dispatch(findOrder(id));
    }
  }, [id, order, findLoading, feedOrders, profileOrders, dispatch]);

  const enrichedOrders = useEnrichedOrders(order ? [order] : []);
  const enrichedOrder = enrichedOrders?.[0];

  if (findLoading && !enrichedOrder) {
    return <Preloader />;
  }

  if (findError && !enrichedOrder) {
    return (
      <div className="text text_type_main-medium mt-5">
        Ошибка загрузки заказа: {findError}
      </div>
    );
  }

  if (!enrichedOrder) {
    return <div className="text text_type_main-medium mt-5">Заказ не найден...</div>;
  }

  const statusInfo = getStatusInfo(enrichedOrder.status);

  return (
    <section>
      <div
        className={`${styles.order_number} text text_type_digits-default mb-10 ${centerHeader ? styles.center_order_number : ''}`}
      >
        #{enrichedOrder.number.toString().padStart(6, '0')}
      </div>
      <h1 className="text text_type_main-medium mb-3">{enrichedOrder.name}</h1>
      <div className={`text text_type_main-default mb-15 ${statusInfo.className}`}>
        {statusInfo.text}
      </div>
      <div className="text text_type_main-medium mb-6">Состав:</div>
      <div className={`text text_type_main-medium mb-10`}>
        <OrderInfoContents ingredients={enrichedOrder.ingredientsObjects} />
      </div>
      <div
        className={`text text_type_main-medium order_date_price ${styles.order_date_price}`}
      >
        <FormattedDate
          className={`${styles.date} text text_type_main-default`}
          date={new Date(enrichedOrder.createdAt)}
        />
        <div className={`${styles.price}`}>
          <p className="text text_type_digits-default mr-1">
            {enrichedOrder.orderPrice}
          </p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </section>
  );
};
