import styles from './order-info-wrapper.module.css';

type OrderInfoWrapperProps = {
  children?: React.ReactNode;
};

export const OrderInfoWrapper = ({
  children,
}: OrderInfoWrapperProps): React.JSX.Element => {
  return <section className={`${styles.order_info_wrapper}`}>{children}</section>;
};
