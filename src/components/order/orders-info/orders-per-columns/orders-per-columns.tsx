import styles from './orders-per-columns.module.css';

type OrdersPerColumnsProps = {
  orderNums: string[];
  isDone?: boolean;
};

export const OrdersPerColumns = ({
  orderNums,
  isDone,
}: OrdersPerColumnsProps): React.JSX.Element => {
  const itemsPerColumn = 5;
  const columnCount = 2;

  const columns = [];
  for (let i = 0; i < columnCount; i++) {
    columns.push(orderNums.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
  }

  return (
    <div className={styles.two_columns}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className={styles.column}>
          {column.map((orderNum, index) => (
            <div
              key={columnIndex * itemsPerColumn + index}
              className={`${isDone && styles.done_orders} text_type_digits-default mb-2`}
            >
              {orderNum}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
