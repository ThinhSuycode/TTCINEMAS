import classNames from "classnames/bind";
import styles from "./Menu.module.scss";
import Button from "../../Button";
const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
  return (
    <Button
      className={cx("menu-item")}
      iconLeft={data.icon}
      to={data.to}
      icon={data.iconX || ""}
      onClick={onClick}
    >
      {data.titleVi}
    </Button>
  );
}

export default MenuItem;
