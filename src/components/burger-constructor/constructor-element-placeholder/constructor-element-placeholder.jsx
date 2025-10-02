import styles from './constructor-element-placeholder.module.css';

export const ConstructorElementPlaceholder = ({ type, text, isHover, canDrop }) => {
  let typeStyle;
  if (type === 'top') {
    typeStyle = 'placeholder_top';
  } else if (type === 'bottom') {
    typeStyle = 'placeholder_bottom';
  } else {
    typeStyle = 'placeholder_body';
  }

  let dndStyle;
  if (isHover) {
    dndStyle = 'placeholder_hover';
  } else if (canDrop) {
    dndStyle = 'placeholder_drop';
  }

  return (
    <section className={`${styles.placeholder_container}`}>
      <div
        className={`${styles.placeholder} ${styles[typeStyle]} ${styles[dndStyle]} text text_type_main-default`}
      >
        {text}
      </div>
    </section>
  );
};
