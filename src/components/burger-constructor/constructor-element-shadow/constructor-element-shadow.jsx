import styles from './constructor-element-shadow.module.css';

export const ConstructorElementShadow = ({ type, text, isHover, canDrop }) => {
  let typeStyle;
  if (type === 'top') {
    typeStyle = 'shadow_top';
  } else if (type === 'bottom') {
    typeStyle = 'shadow_bottom';
  } else {
    typeStyle = 'shadow_body';
  }

  let dndStyle;
  if (isHover) {
    dndStyle = 'shadow_hover';
  } else if (canDrop) {
    dndStyle = 'shadow_drop';
  }

  return (
    <section className={`${styles.shadow_container}`}>
      <div
        className={`${styles.shadow_main} ${styles[typeStyle]} ${dndStyle ? styles[dndStyle] : ''} text_type_main-default`}
      >
        {text}
      </div>
    </section>
  );
};
