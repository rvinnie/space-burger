import styles from './constructor-element-placeholder.module.css';

export const ConstructorElementPlaceholder = ({ type, text }) => {
  let styleName;
  if (type === 'top') {
    styleName = 'placeholder_top';
  } else if (type === 'bottom') {
    styleName = 'placeholder_bottom';
  } else {
    styleName = 'placeholder_body';
  }

  return (
    <section className={`${styles.placeholder_container}`}>
      <div
        className={`${styles.placeholder} ${styles[styleName]} text text_type_main-default`}
      >
        {text}
      </div>
    </section>
  );
};
