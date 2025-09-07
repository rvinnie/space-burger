import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useEffect } from 'react';

import { IngredientGroup } from '@components/burger-ingredients/ingredient-group/ingredient-group';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const groupFieldValuePairs = new Map([
    ['bun', 'Булки'],
    ['main', 'Начинки'],
    ['sauce', 'Соусы'],
  ]);

  const [activeTab, setActiveTab] = useState('bun');
  const groupsContainerRef = useRef(null);
  const groupRefs = useRef({});

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
            ingredients={ingredients?.filter(
              (ingredient) => ingredient.type === fieldName
            )}
          />
        ))}
      </section>
    </section>
  );
};
