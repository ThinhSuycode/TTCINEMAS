import classNames from "classnames/bind";
import style from "./GlobalStyle.module.css";
const cx = classNames.bind(style);

function GlobalStyles({ children }) {
  return <div className={cx("Wrapper")}>{children}</div>;
}

export default GlobalStyles;
