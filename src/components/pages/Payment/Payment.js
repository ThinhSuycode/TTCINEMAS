import styles from "./Payment.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Payment() {
  return (
    <div className={cx("Payment-Wrapper")}>
      <div className={cx("Payment-inner")}>
        <h1>Page Payment</h1>
      </div>
    </div>
  );
}

export default Payment;
