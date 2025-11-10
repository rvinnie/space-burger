import { removeIngredient } from '@/services/burder-constructor';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import type { TIngredient } from '@/shared/types/ingredient';
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

import styles from './constructor-element-container.module.css';

type ConstructorElementContainerProps = {
  ingredient: TIngredient & { constructorElementId?: string };
  index: number;
  ingredientType?: 'top' | 'bottom';
  isHover: boolean;
  canDrop: boolean;
  handleMoveIngredients: (dragIdx: number, hoverIdx: number) => void;
};

type DragItem = {
  id: string;
  index: number;
  type: string;
};

type CollectedDragProps = {
  isDragging: boolean;
};

type DropCollectedProps = Record<string, never>;

type DndStyleClass = 'constructor_element_hover' | 'constructor_element_drop';

export const ConstructorElementContainer = ({
  ingredient,
  index,
  ingredientType,
  isHover,
  canDrop,
  handleMoveIngredients,
}: ConstructorElementContainerProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const isBun = ingredient?.type === 'bun';

  let bunDescription = '';
  if (ingredientType === 'top') {
    bunDescription = ' (верх)';
  } else if (ingredientType === 'bottom') {
    bunDescription = ' (низ)';
  }

  let dndStyle: DndStyleClass | undefined;
  if (isHover) {
    dndStyle = 'constructor_element_hover';
  } else if (canDrop) {
    dndStyle = 'constructor_element_drop';
  }

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, void, CollectedDragProps>({
    type: 'sorting',
    item: (): DragItem => {
      return {
        id: ingredient.constructorElementId!,
        index,
        type: 'sorting',
      };
    },
    canDrag: () => !isBun,
    collect: (monitor: DragSourceMonitor<DragItem, void>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem, void, DropCollectedProps>({
    accept: 'sorting',
    canDrop: () => !isBun,
    hover: (item: DragItem, monitor: DropTargetMonitor<DragItem, void>) => {
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

      if (!clientOffset) return;

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
        extraClass={`${dndStyle ? styles[dndStyle] : ''} ${styles.constructor_element}`}
      />
    </section>
  );
};
