import { getBun, getConstructorIngredients } from '@/services/burder-constructor';
import { getIngredients } from '@/services/burger-ingredients';
import { getIngredient } from '@/services/ingredient-details';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { IngredientDetails } from '@components/burger-ingredients/ingredient-details/ingredient-details';
import { IngredientGroup } from '@components/burger-ingredients/ingredient-group/ingredient-group';
import { Modal } from '@components/modal/modal';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = () => {
  const groupFieldValuePairs = new Map([
    ['bun', 'Булки'],
    ['main', 'Начинки'],
    ['sauce', 'Соусы'],
  ]);

  const [openedModal, setModalOpen] = useState({
    isOpened: false,
    ingredientId: '',
  });
  const [activeTab, setActiveTab] = useState('bun');
  const groupsContainerRef = useRef(null);
  const groupRefs = useRef({});

  const ingredientsInConstructor = useSelector(getConstructorIngredients);
  const bunInConstructor = useSelector(getBun);
  const ingredients = useSelector(getIngredients);

  const ingredientsCounts = useMemo(() => {
    let counts = {};

    if (ingredientsInConstructor) {
      counts = ingredientsInConstructor.reduce((accumulator, item) => {
        accumulator[item._id] = (accumulator[item._id] || 0) + 1;
        return accumulator;
      }, {});
    }

    if (bunInConstructor) {
      counts[bunInConstructor._id] = 2;
    }

    return counts;
  }, [ingredientsInConstructor, bunInConstructor]);

  const selectedIngredient = useSelector(getIngredient);
  useEffect(() => {
    if (selectedIngredient) {
      setModalOpen({
        isOpened: true,
        ingredientId: selectedIngredient._id,
      });
    }
  }, [selectedIngredient]);

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
    const group = groupRefs.current[tabValue];
    if (group && groupsContainerRef.current) {
      group.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!groupsContainerRef.current) return;

    let newActiveTab = activeTab;
    let minOffset = Infinity;

    Object.entries(groupRefs.current).forEach(([name, group]) => {
      if (!group) return;

      const rect = group.getBoundingClientRect();
      const containerRect = groupsContainerRef.current.getBoundingClientRect();

      const offset = Math.abs(rect.top - containerRect.top);

      if (offset < minOffset) {
        minOffset = offset;
        newActiveTab = name;
      }
    });

    setActiveTab(newActiveTab);
  };

  useEffect(() => {
    if (groupsContainerRef.current) {
      groupsContainerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (groupsContainerRef.current) {
        groupsContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <section className={`${styles.burger_ingredients}`}>
      <nav>
        <ul className={styles.menu}>
          {Array.from(groupFieldValuePairs).map(([fieldName, valueName]) => (
            <Tab
              key={fieldName}
              value={fieldName}
              active={activeTab === fieldName}
              onClick={() => handleTabClick(fieldName)}
            >
              {valueName}
            </Tab>
          ))}
        </ul>
      </nav>
      <section
        ref={groupsContainerRef}
        className={`${styles.ingredient_groups_container} pr-4`}
      >
        {Array.from(groupFieldValuePairs).map(([fieldName, valueName]) => (
          <IngredientGroup
            ref={(el) => (groupRefs.current[fieldName] = el)}
            key={fieldName}
            groupName={valueName}
            ingredientsCounts={ingredientsCounts}
            ingredients={ingredients.data.filter(
              (ingredient) => ingredient.type === fieldName
            )}
          />
        ))}
      </section>
      {openedModal.isOpened && (
        <Modal
          header={'Детали ингредиента'}
          onClose={() => setModalOpen({ isOpened: false, ingredientId: '' })}
        >
          <IngredientDetails
            ingredient={ingredients.data.find((element) => {
              return element._id === openedModal.ingredientId;
            })}
          />
        </Modal>
      )}
    </section>
  );
};
