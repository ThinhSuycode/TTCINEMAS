import classNames from "classnames/bind";
import styles from "./Menu.module.scss";
import Tippy from "@tippyjs/react/headless";
import Wrapper from "../Wrapper";
import { useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import PropsTypes from "prop-types";

import HeaderMenu from "./HeaderMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faPlus,
  faSignOut,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { config } from "../../../config";
const cx = classNames.bind(styles);

function Menu({ children, menuData = [] }) {
  const [itemMenu, setItemMenu] = useState(null);
  const onHandleLogout = () => {
    localStorage.setItem("userActive", JSON.stringify({}));
    alert("Đăng xuất thành công !!");
    window.location.href = "/";
  };
  useEffect(() => {
    if (itemMenu !== null) {
      localStorage.setItem("checkUserIdx", JSON.stringify(itemMenu));
    }
  }, [itemMenu]);
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("changItemMenuIdx", { detail: itemMenu })
    );
  }, [itemMenu]);

  const [history, setHistory] = useState([{ data: menuData }]);
  const [selectMenuUser, setSelectMenuUser] = useState({});
  useEffect(() => {
    localStorage.setItem("selectMenuUser", JSON.stringify(selectMenuUser));
  }, [selectMenuUser]);
  const current = history[history.length - 1];
  console.log(menuData, current);
  const renderItem = () => {
    return current.data.map((item, idx) => (
      <MenuItem
        key={idx}
        data={item}
        onClick={() => {
          const isParent = !!item.children;
          setItemMenu(idx);
          if (isParent) {
            setHistory((prev) => [...prev, item.children]);
          } else {
            return;
          }
          setSelectMenuUser(item);
        }}
      ></MenuItem>
    ));
  };
  return (
    <Tippy
      offset={[0, 5]}
      delay={[0, 500]} // delay [show, hide]
      interactive
      //   hideOnClick={hideOnClick}
      placement="bottom-end"
      render={(attrs) => (
        <div className={cx("Menu-inner")} tabIndex="-1" {...attrs}>
          <Wrapper className={cx("menu-wrapper")}>
            {history.length > 1 && (
              <HeaderMenu
                title={current.title}
                onBack={() => {
                  setHistory((prev) => prev.slice(0, prev.length - 1)); //nen dung slice thay vi splice 2 cai khac nhau
                }}
              ></HeaderMenu>
            )}
            {renderItem()}
            <div className={cx("amount-line")}>
              <div className={cx("amount-left")}>
                <span>
                  <FontAwesomeIcon icon={faWallet}></FontAwesomeIcon>
                </span>
                <span>Số dư</span>
              </div>
              <div className={cx("amount-right")}>
                <span>0</span>
                <span>
                  <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>
                </span>
              </div>
              <a
                href={config.routes.WalletTotal}
                className={cx("btn-upWallet")}
              >
                <span>
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                </span>
                <span>Nạp</span>
              </a>
            </div>
            <button className={cx("logout")} onClick={onHandleLogout}>
              <span>
                <FontAwesomeIcon icon={faSignOut} />
              </span>
              <span> Đăng xuất</span>
            </button>
          </Wrapper>
        </div>
      )}
      onHide={() => setHistory((prev) => prev.slice(0, 1))} //giup khi menu tu tat se quay lai trang dau tien
    >
      {children}
    </Tippy>
  );
}
Menu.prototype = {
  children: PropsTypes.string.isRequired,
  menuItem: PropsTypes.array,
  hideOnClick: PropsTypes.bool,
  onChange: PropsTypes.func,
};

export default Menu;
