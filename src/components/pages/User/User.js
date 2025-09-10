import classNames from "classnames/bind";
import styles from "./User.module.scss";
import UserSideBar from "./UserSideBar/UserSideBar";
import Profile from "../Profile/Profile";
import {
  faHeart,
  faPlus,
  faCircleQuestion,
  faUser,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageOnly from "../../PageOnly/PageOnly";

const cx = classNames.bind(styles);
const MENU_ITEMS = [
  {
    icon: <FontAwesomeIcon icon={faCircleQuestion}></FontAwesomeIcon>,
    titleVi: "Hỗ trợ khách hàng",
    to: "/feedback",
  },
];

const userMenu = [
  {
    icon: <FontAwesomeIcon icon={faUser} />,
    titleVi: "Tài khoản",
    titleEn: "profile",
    to: "/user/profile",
  },
  {
    icon: <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>,
    titleVi: "Danh sách",
    titleEn: "playlist",
    to: "/user/playlist",
  },
  {
    icon: <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>,
    titleVi: "Yêu thích",
    titleEn: "favorite",
    to: "/user/favorite",
  },
  ,
  {
    icon: <FontAwesomeIcon icon={faGear} />,
    titleVi: "Cài đặt",
    to: "/settings",
  },
  ...MENU_ITEMS,
];
function User({ children }) {
  return (
    <PageOnly>
      <div className={cx("User-Wrapper")}>
        <div className={cx("User-inner")}>
          <div className={cx("User-list")}>
            <div className={cx("User-left")}>
              <UserSideBar data={userMenu}></UserSideBar>
            </div>
            <div className={cx("User-right")}>{children}</div>
          </div>
        </div>
      </div>
    </PageOnly>
  );
}

export default User;
