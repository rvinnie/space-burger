import styles from './constructor-element-shadow.module.css';

type ConstructorElementShadowProps = {
  type: 'top' | 'bottom' | 'body';
  text: string;
  isHover: boolean;
  canDrop: boolean;
};

export const ConstructorElementShadow = ({
  type,
  text,
  isHover,
  canDrop,
}: ConstructorElementShadowProps): React.JSX.Element => {
  const getTypeStyle = (): string => {
    switch (type) {
      case 'top':
        return styles.shadow_top;
      case 'bottom':
        return styles.shadow_bottom;
      default:
        return styles.shadow_body;
    }
  };

  const getDndStyle = (): string => {
    if (isHover) return styles.shadow_hover;
    if (canDrop) return styles.shadow_drop;
    return '';
  };

  const typeStyle = getTypeStyle();
  const dndStyle = getDndStyle();

  return (
    <section className={`${styles.shadow_container}`}>
      <div
        className={`${styles.shadow_main} ${typeStyle} ${dndStyle} text_type_main-default`}
      >
        {text}
      </div>
    </section>
  );
};
