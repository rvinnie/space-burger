import { getBun, getConstructorIngredients } from '@/services/burder-constructor';
import { getIngredients } from '@/services/burger-ingredients';
import { useSelector } from '@/services/store';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';

import { IngredientGroup } from '@components/burger-ingredients/ingredient-group/ingredient-group';

import type { TIngredient } from '@/shared/types/ingredient';

import styles from './burger-ingredients.module.css';

type GroupRefs = Record<string, HTMLDivElement | null>;

type IngredientsCounts = Record<string, number>;

export const BurgerIngredients = (): React.JSX.Element => {
  const groupFieldValuePairs = new Map<string, string>([
    ['bun', 'Булки'],
    ['main', 'Начинки'],
    ['sauce', 'Соусы'],
  ]);

  const [activeTab, setActiveTab] = useState<string>('bun');
  const groupsContainerRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<GroupRefs>({});

  const ingredientsInConstructor = useSelector(getConstructorIngredients);
  const bunInConstructor = useSelector(getBun);
  const ingredients = useSelector(getIngredients);

  const ingredientsCounts = useMemo<IngredientsCounts>(() => {
    const counts: IngredientsCounts = {};

    if (ingredientsInConstructor) {
      ingredientsInConstructor.forEach((item: TIngredient) => {
        counts[item._id] = (counts[item._id] || 0) + 1;
      });
    }

    if (bunInConstructor) {
      counts[bunInConstructor._id] = 2;
    }

    return counts;
  }, [ingredientsInConstructor, bunInConstructor]);

  const handleTabClick = (tabValue: string): void => {
    setActiveTab(tabValue);
    const group = groupRefs.current[tabValue];
    if (group && groupsContainerRef.current) {
      group.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = (): void => {
    if (!groupsContainerRef.current) return;

    let newActiveTab = activeTab;
    let minOffset = Infinity;

    Object.entries(groupRefs.current).forEach(([name, group]) => {
      if (!group) return;

      const rect = group.getBoundingClientRect();

      if (!groupsContainerRef.current) return;

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

    return (): void => {
      if (groupsContainerRef.current) {
        groupsContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const setGroupRef = useCallback(
    (fieldName: string) =>
      (el: HTMLDivElement | null): void => {
        groupRefs.current[fieldName] = el;
      },
    []
  );

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
            ref={setGroupRef(fieldName)}
            key={fieldName}
            groupName={valueName}
            ingredientsCounts={ingredientsCounts}
            ingredients={ingredients?.data.filter(
              (ingredient: TIngredient) => ingredient.type === fieldName
            )}
          />
        ))}
      </section>
    </section>
  );
};
