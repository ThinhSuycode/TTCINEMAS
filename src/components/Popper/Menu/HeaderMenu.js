import classNames from "classnames/bind";
import styles from "./Menu.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropsTypes from "prop-types";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function HeaderMenu({ title, onBack }) {
  return (
    <header className={cx("header")}>
      <button className={cx("btn-back")} onClick={onBack}>
        <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
      </button>
      <h4 className={cx("header-title")}>{title}</h4>
    </header>
  );
}
HeaderMenu.prototype = {
  title: PropsTypes.string.isRequired,
  onBack: PropsTypes.string.isRequired,
};

export default HeaderMenu;
