import { getBun, getIngredients } from '@/services/burder-constructor';
import {
  getOrderDetails,
  getOrderDetailsError,
  createOrder,
} from '@/services/order-details';
import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ConstructorElementContainer } from '@components/burger-constructor/constructor-element-container/constructor-element-container';
import { ConstructorPrice } from '@components/burger-constructor/constructor-price/constructor-price';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order/order-details/order-details';

import { ConstructorElementPlaceholder } from './constructor-element-placeholder/constructor-element-placeholder';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const dispatch = useDispatch();

  const orderDetails = useSelector(getOrderDetails);
  const orderDetailsError = useSelector(getOrderDetailsError);

  const [isModalOpen, setModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState(0);

  useEffect(() => {
    if (orderDetails) {
      setOrderNumber(orderDetails.order.number);
      setModalOpen(true);
    }
  }, [orderDetails]);

  useEffect(() => {
    if (orderDetailsError) {
      console.error('Произошла ошибка: ', orderDetailsError);
    }
  }, [orderDetailsError]);

  const bun = useSelector(getBun);
  const bodyIngredients = useSelector(getIngredients);

  const handleOrderClick = (ingredients) => {
    dispatch(createOrder(ingredients));
  };

  const totalPrice = useMemo(() => {
    const bunsPrice = bun !== null ? bun.price + bun.price : 0;

    const ingredientsPrice =
      bodyIngredients.length !== 0
        ? bodyIngredients.reduce((total, ingredient) => total + ingredient.price, 0)
        : 0;

    return bunsPrice + ingredientsPrice;
  }, [bun, bodyIngredients]);

  const getBunBody = (ingredientType) => {
    return bun ? (
      <ConstructorElementContainer ingredient={bun} ingredientType={ingredientType} />
    ) : (
      <ConstructorElementPlaceholder
        type={ingredientType}
        text="Выберите и перетащите булку"
      />
    );
  };

  const getIngredientsBody = () => {
    return bodyIngredients.length > 0 ? (
      <div className={`${styles.constructor_body}`}>
        {bodyIngredients.map((ingredient) => (
          <ConstructorElementContainer
            ingredient={ingredient}
            key={ingredient.constructorElementId}
          />
        ))}
      </div>
    ) : (
      <ConstructorElementPlaceholder
        type="body"
        text="Выберите и перетащите ингредиенты"
      />
    );
  };

  return (
    <section className={`${styles.burger_constructor} ml-4`}>
      <section className={`${styles.constructor_container}`}>
        {getBunBody('top')}
        {getIngredientsBody()}
        {getBunBody('bottom')}
      </section>
      <ConstructorPrice
        price={totalPrice}
        onModalOpen={() => handleOrderClick(ingredients)}
      />
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </section>
  );
};
