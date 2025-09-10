import classNames from "classnames/bind";
import styles from "./UserSideBar.module.scss";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function UserSideBar({ data = [] }) {
  const [checkItemIdx, setCheckItemIdx] = useState(null);

  // Lấy giá trị đã lưu từ localStorage khi load lần đầu
  useEffect(() => {
    const savedIdx = localStorage.getItem("checkUserIdx");
    if (savedIdx !== null) {
      setCheckItemIdx(JSON.parse(savedIdx));
    }
  }, []);
  console.log(checkItemIdx);
  useEffect(() => {
    const getItemMenuUser = (e) => {
      const target = e.detail;
      setCheckItemIdx(target);
      localStorage.setItem("checkUserIdx", JSON.stringify(target));
    };
    window.addEventListener("changItemMenuIdx", getItemMenuUser);
    return () => {
      window.removeEventListener("changItemMenuIdx", getItemMenuUser);
    };
  }, []);

  // Lưu lại khi thay đổi checkItemIdx
  useEffect(() => {
    if (checkItemIdx !== null) {
      localStorage.setItem("checkUserIdx", JSON.stringify(checkItemIdx));
    }
  }, [checkItemIdx]);

  return (
    <div className={cx("UserSideBar-Wrapper")}>
      <h3 className={cx("UserSideBar__heading")}>Quản lý tài khoản</h3>
      <div className={cx("UserSideBar-list")}>
        {data.map((item, idx) => (
          <a
            key={idx}
            href={item.to}
            className={cx("UserSideBar-item", {
              activeItem: checkItemIdx === idx,
            })}
            onClick={() => setCheckItemIdx(idx)}
          >
            <span className={cx("icon")}>{item.icon}</span>
            <span className={cx("title")}>{item.titleVi}</span>
          </a>
        ))}
      </div>
      <a href="/logout" className={cx('logout')}>
        <span>
          <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>
        </span>
        <span>Đăng xuất</span>
      </a>
    </div>
  );
}

export default UserSideBar;
