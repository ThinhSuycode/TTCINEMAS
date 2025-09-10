import styles from "./Button.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
const cx = classNames.bind(styles);

function Button({
  to,
  href,
  primary = false,
  outline = false,
  small = false,
  large = false,
  text = false,
  disable = false,
  rounded = false,
  className,
  iconLeft = false,
  iconRight = false,
  children,
  onClick,
  ...passProps
}) {
  let Comp = "button";
  const classes = cx("wrapper", {
    [className]: className, //className này đc scss trong header.module.scss
    primary,
    outline,
    small,
    large,
    rounded,
    text,
    iconLeft,
    iconRight,
    disable,
    ...passProps,
  });
  let props = {
    onClick,
    ...passProps,
  };
  //C1 : để thực hiện việc xoá event onClick khi có .disable
  // if (disable) {
  //   delete props.onClick;
  // }
  //C2: dùng cách này sẽ hiệu quả hơn
  if (disable) {
    Object.keys(props).forEach((keys) => {
      if (keys.startsWith("on") && typeof props[keys] === "function") {
        delete props[keys];
      }
    });
  }
  if (to) {
    props.to = to;
    Comp = Link;
  } else if (href) {
    props.href = href;
    Comp = "a";
  }
  return (
    <Comp className={classes} {...props}>
      {iconLeft && <span className={cx("icon")}>{iconLeft}</span>}
      <span className={cx("tittle")}>{children}</span>
      {iconRight && <span className={cx("icon")}>{iconRight}</span>}
    </Comp>
  );
}
//Dùng để bắt lỗi truyền giá trị
Button.prototype = {
  to: PropTypes.string,
  href: PropTypes.string,
  classNames: PropTypes.string,
  primary: PropTypes.bool,
  outline: PropTypes.bool,
  small: PropTypes.bool,
  large: PropTypes.bool,
  rounded: PropTypes.bool,
  text: PropTypes.bool,
  iconLeft: PropTypes.bool,
  iconRight: PropTypes.bool,
  disable: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};
export default Button;
