import {
  addIngredient,
  getBun,
  getIngredients,
  moveIngredients,
  setBun,
} from '@/services/burder-constructor';
import {
  getOrderDetails,
  getOrderDetailsError,
  createOrder,
} from '@/services/order-details';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { ConstructorElementContainer } from '@components/burger-constructor/constructor-element-container/constructor-element-container';
import { ConstructorPrice } from '@components/burger-constructor/constructor-price/constructor-price';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order/order-details/order-details';

import { ConstructorElementPlaceholder } from './constructor-element-placeholder/constructor-element-placeholder';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();
  const [{ isHover, isBun, canDrop }, dropTarget] = useDrop({
    accept: 'ingredient',
    collect: (monitor) => {
      const item = monitor.getItem();
      return {
        isHover: monitor.isOver(),
        canDrop: monitor.canDrop(),
        isBun: item?.type === 'bun',
      };
    },
    drop(ingredient) {
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    },
  });

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

  const handleOrderClick = () => {
    dispatch(createOrder([bun, ...bodyIngredients, bun]));
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
      <ConstructorElementContainer
        ingredient={bun}
        ingredientType={ingredientType}
        isHover={isBun && isHover}
        canDrop={isBun && canDrop}
      />
    ) : (
      <ConstructorElementPlaceholder
        isHover={isBun && isHover}
        canDrop={isBun && canDrop}
        type={ingredientType}
        text="Выберите и перетащите булку"
      />
    );
  };

  const handleMoveIngredients = useCallback(
    (dragIndex, hoverIndex) => {
      dispatch(moveIngredients({ dragIndex, hoverIndex }));
    },
    [dispatch]
  );

  const getIngredientsBody = () => {
    return bodyIngredients.length > 0 ? (
      <div className={`${styles.constructor_body}`}>
        {bodyIngredients.map((ingredient, index) => (
          <ConstructorElementContainer
            ingredient={ingredient}
            index={index}
            key={ingredient.constructorElementId}
            isHover={!isBun && isHover}
            canDrop={!isBun && canDrop}
            handleMoveIngredients={handleMoveIngredients}
          />
        ))}
      </div>
    ) : (
      <ConstructorElementPlaceholder
        type="body"
        text="Выберите и перетащите ингредиенты"
        isHover={!isBun && isHover}
        canDrop={!isBun && canDrop}
      />
    );
  };

  const isPriceDisabled = bun === null || bodyIngredients.length === 0;

  return (
    <section className={`${styles.burger_constructor} ml-4`}>
      <section ref={dropTarget} className={`${styles.constructor_container}`}>
        {getBunBody('top')}
        {getIngredientsBody()}
        {getBunBody('bottom')}
      </section>
      <ConstructorPrice
        price={totalPrice}
        onModalOpen={() => handleOrderClick()}
        isDisabled={isPriceDisabled}
      />
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </section>
  );
};
