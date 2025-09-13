import styles from './pfc-element.module.css';

export const PfcElement = ({ title, value }) => {
  return (
    <div className={styles.pfc_element}>
      <div className="text text_type_main-default text_color_inactive">{title}</div>
      <div className="text text_type_digits-default text_color_inactive">{value}</div>
    </div>
  );
};
