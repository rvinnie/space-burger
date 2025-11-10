import styles from './pfc-element.module.css';

type PfcElementProps = {
  title: string;
  value: string;
};

export const PfcElement = ({ title, value }: PfcElementProps): React.JSX.Element => {
  return (
    <div className={styles.pfc_element}>
      <div className="text text_type_main-default text_color_inactive">{title}</div>
      <div className="text text_type_digits-default text_color_inactive">{value}</div>
    </div>
  );
};
