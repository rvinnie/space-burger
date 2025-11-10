import {
  addIngredient,
  getBun,
  getConstructorIngredients,
  moveIngredients,
  clearIngredients,
  setBun,
} from '@/services/burder-constructor';
import {
  getOrderDetails,
  getOrderDetailsError,
  getOrderDetailsLoading,
  createOrder,
  clearOrderDetails,
} from '@/services/order-details';
import { getIsAuthenticated } from '@/services/user';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ConstructorElementContainer } from '@components/burger-constructor/constructor-element-container/constructor-element-container';
import { ConstructorPrice } from '@components/burger-constructor/constructor-price/constructor-price';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order/order-details/order-details';

import { ConstructorElementShadow } from './constructor-element-shadow/constructor-element-shadow';

import type { TIngredient } from '@/shared/types/ingredient';

import styles from './burger-constructor.module.css';

type TDropResult = {
  isHover: boolean;
  canDrop: boolean;
  isBun: boolean;
};

type DragObject = {
  index: number;
} & TIngredient;

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const [{ isHover, isBun, canDrop }, dropTarget] = useDrop<
    DragObject,
    void,
    TDropResult
  >({
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
  const orderDetailsLoading = useSelector(getOrderDetailsLoading);
  const orderDetailsError = useSelector(getOrderDetailsError);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<number>(0);

  const navigate = useNavigate();

  const closeModal = (): void => {
    setError(false);
    setModalOpen(false);
    dispatch(clearOrderDetails());
  };

  useEffect(() => {
    if (orderDetails) {
      // @ts-expect-error "sprint-5"
      setOrderNumber(orderDetails.order.number);
      setLoading(false);
      setModalOpen(true);
      setError(false);
      // @ts-expect-error "sprint-5"
      dispatch(clearIngredients());
    }
  }, [orderDetails]);

  useEffect(() => {
    if (orderDetailsLoading) {
      setLoading(true);
      setModalOpen(true);
      setError(false);
    }
  }, [orderDetailsLoading]);

  useEffect(() => {
    if (orderDetailsError) {
      setLoading(false);
      setModalOpen(true);
      setError(true);
    }
  }, [orderDetailsError]);

  const bun = useSelector(getBun);
  const bodyIngredients = useSelector(getConstructorIngredients);

  const handleOrderClick = (): void => {
    if (isAuthenticated) {
      // @ts-expect-error "sprint-5"
      dispatch(createOrder([bun, ...bodyIngredients, bun]));
    } else {
      navigate('/login');
    }
  };

  const totalPrice = useMemo(() => {
    // @ts-expect-error "sprint-5"
    const bunsPrice = bun !== null ? bun.price + bun.price : 0;

    const ingredientsPrice =
      // @ts-expect-error "sprint-5"
      bodyIngredients.length !== 0
        ? // @ts-expect-error "sprint-5"
          bodyIngredients.reduce((total, ingredient) => total + ingredient.price, 0)
        : 0;

    return bunsPrice + ingredientsPrice;
  }, [bun, bodyIngredients]);

  const getBunBody = (ingredientType: 'top' | 'bottom'): React.JSX.Element => {
    return bun ? (
      <ConstructorElementContainer
        // @ts-expect-error "sprint-5"
        ingredient={bun}
        ingredientType={ingredientType}
        isHover={isBun && isHover}
        canDrop={isBun && canDrop}
      />
    ) : (
      <ConstructorElementShadow
        isHover={isBun && isHover}
        canDrop={isBun && canDrop}
        type={ingredientType}
        text="Выберите и перетащите булку"
      />
    );
  };

  const handleMoveIngredients = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(moveIngredients({ dragIndex, hoverIndex }));
    },
    [dispatch]
  );

  const getIngredientsBody = (): React.JSX.Element => {
    // @ts-expect-error "sprint-5"
    return bodyIngredients.length > 0 ? (
      <div className={`${styles.constructor_body}`}>
        {
          // @ts-expect-error "sprint-5"
          bodyIngredients.map((ingredient, index) => (
            <ConstructorElementContainer
              ingredient={ingredient}
              index={index}
              key={ingredient.constructorElementId}
              isHover={!isBun && isHover}
              canDrop={!isBun && canDrop}
              handleMoveIngredients={handleMoveIngredients}
            />
          ))
        }
      </div>
    ) : (
      <ConstructorElementShadow
        type="body"
        text="Выберите и перетащите ингредиенты"
        isHover={!isBun && isHover}
        canDrop={!isBun && canDrop}
      />
    );
  };

  // @ts-expect-error "sprint-5"
  const isPriceDisabled = bun === null || bodyIngredients.length === 0;
  const modalHeader = isError ? 'Произошла ошибка...' : '';

  return (
    <section className={`${styles.burger_constructor} ml-4`}>
      <section
        ref={dropTarget as unknown as React.RefObject<HTMLElement>}
        className={`${styles.constructor_container}`}
      >
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
        <Modal onClose={closeModal} header={modalHeader}>
          <OrderDetails
            orderNumber={orderNumber}
            isLoading={isLoading}
            isError={isError}
          />
        </Modal>
      )}
    </section>
  );
};
