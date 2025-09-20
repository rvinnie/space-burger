import { removeIngredient } from '@/services/burder-constructor';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import styles from './constructor-element-container.module.css';

export const ConstructorElementContainer = ({
  ingredient,
  index,
  ingredientType,
  isHover,
  canDrop,
  handleMoveIngredients,
}) => {
  const dispatch = useDispatch();
  const isBun = ingredient?.type === 'bun';

  let bunDescription = '';
  if (ingredientType === 'top') {
    bunDescription = ' (верх)';
  } else if (ingredientType === 'bottom') {
    bunDescription = ' (низ)';
  }

  let dndStyle;
  if (isHover) {
    dndStyle = 'constructor_element_hover';
  } else if (canDrop) {
    dndStyle = 'constructor_element_drop';
  }

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'sorting',
    item: () => {
      return {
        id: ingredient.constructorElementId,
        index,
      };
    },
    canDrag: () => !isBun,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'sorting',
    canDrop: () => !isBun,
    hover: (item, monitor) => {
      if (!ref.current || isBun) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      handleMoveIngredients(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  if (!isBun) {
    drag(drop(ref));
  }

  const opacity = isDragging ? 0 : 1;

  return (
    <section
      ref={ref}
      style={{ opacity }}
      className={`${styles.constructor_element_container}`}
    >
      {!isBun && <DragIcon className={`${styles.constructor_drag}`} type="primary" />}
      <ConstructorElement
        handleClose={() =>
          !isBun && dispatch(removeIngredient(ingredient.constructorElementId))
        }
        isLocked={isBun}
        price={ingredient?.price}
        text={ingredient?.name + bunDescription}
        thumbnail={ingredient?.image}
        type={ingredientType}
        extraClass={`${styles[dndStyle]} ${styles.constructor_element}`}
      />
    </section>
  );
};
