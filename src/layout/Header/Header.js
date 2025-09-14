import style from "./Header.module.scss";
import classNames from "classnames/bind";
import { config } from "../../config";
import { useEffect, useState, useCallback, useMemo } from "react";
import logo from "../../assets/images/LOGO.png";
import avatarNull from "../../assets/icon/vietnam.jpg";
import imgLogin from "../../assets/images/TTmovieLogin.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert } from "../../components";
import {
  faBackward,
  faCaretDown,
  faClose,
  faHeart,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Menu from "../../components/Popper/Menu";
import {
  faCircleQuestion,
  faUser,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

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

  {
    icon: <FontAwesomeIcon icon={faGear} />,
    titleVi: "Cài đặt",
    to: "/settings",
  },
  ...MENU_ITEMS,
];
function Header() {
  const [inputSearch, setInputSearch] = useState("");
  const [checkScroll, setCheckScroll] = useState(false);
  const [checkSubmenu, setCheckSubmenu] = useState(false);
  const [selectGenres, setSelectGenres] = useState();
  const [dataGenres, setDataGenres] = useState([]);
  const [checkLogin, setCheckLogin] = useState(false);
  const [statusUser, setStatusUser] = useState("login");
  const [alerts, setAlerts] = useState([]);
  const storedUsers = JSON.parse(localStorage.getItem("listUserAccount")) || [];
  const [userActive, setUserActive] = useState(
    JSON.parse(localStorage.getItem("userActive")) || {}
  );

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const onHandleInputForm = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "register") {
      setRegisterForm({ ...registerForm, [name]: value });
    } else {
      setLoginForm({ ...loginForm, [name]: value });
    }
  };

  const pushAlert = (msg) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message: msg }]);
  };
  // //Lưu giá trị search
  // useEffect(() => {
  //   if (inputSearch.trim()) {
  //     localStorage.setItem("searchInput", JSON.stringify(inputSearch || ""));
  //   }
  // }, [inputSearch]);

  // Ẩn/hiện header khi scroll
  useEffect(() => {
    const hiddenCheck = () => {
      setCheckScroll(window.scrollY > 50);
      setCheckSubmenu(false);
    };
    window.addEventListener("scroll", hiddenCheck);
    return () => {
      window.removeEventListener("scroll", hiddenCheck);
    };
  }, []);
  const onHandleGenres = (item) => {
    setSelectGenres(item);
  };
  useEffect(() => {
    if (selectGenres) {
      localStorage.setItem("selectGenres", JSON.stringify(selectGenres));
    }
  }, [selectGenres]);
  //Nhấn nút esc
  useEffect(() => {
    const downEsc = (e) => {
      const target = e.key;
      if (target === "Escape") {
        setCheckLogin(false);
        setStatusUser("login");
      }
    };
    window.addEventListener("keydown", downEsc);
    return () => {
      window.removeEventListener("keydown", downEsc);
    };
  }, []);

  const clearInput = () => {
    setLoginForm({
      email: "",
      password: "",
    });
    setRegisterForm({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });
  };

  //Thực hiện đăng kí
  const onHandleRegister = useCallback(() => {
    if (!registerForm.username.trim()) {
      pushAlert("Thực hiện nhập tên hiển thị để thực hiện đăng ký !!");
      return;
    }
    if (!registerForm.email.trim()) {
      pushAlert("Thực hiện nhập email để thực hiện đăng ký !!");
      return;
    }
    if (!registerForm.password.trim()) {
      pushAlert("Thực hiện nhập password để thực hiện đăng ký !!");
      return;
    }
    if (!registerForm.confirmPassword.trim()) {
      pushAlert("Thực hiện nhập xác thực mật khẩu để thực hiện đăng ký !!");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      pushAlert("Mật khẩu nhập lại không trùng với mật khẩu trên !!");
      return;
    }
    if (registerForm.password.length <= 8) {
      pushAlert("Mật khẩu bắt buộc phải trên 8 kí tự !!");
      return;
    }
    if (
      storedUsers.findIndex((item) => item.email === registerForm.email) !== -1
    ) {
      pushAlert("Email đăng ký đã bị trùng, vui lòng chọn email khác !!");
      return;
    }

    const userAccountNew = {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      avatar: registerForm.avatar || "",
      storedMovies: [],
      storedActors: [],
      storedPlayList: [],
    };
    storedUsers.push(userAccountNew);
    localStorage.setItem("listUserAccount", JSON.stringify(storedUsers));
    clearInput();
    pushAlert("Đăng ký thành công vui lòng thực hiện đăng nhập!!");
    setStatusUser("login");
  }, [registerForm, storedUsers]);
  //Đăng nhập
  const onHandleLogin = useCallback(() => {
    if (!loginForm.email.trim()) {
      pushAlert("Thực hiện nhập email để thực hiện đăng nhập !!");
      return;
    }
    if (!loginForm.password.trim()) {
      pushAlert("Thực hiện nhập password để thực hiện đăng nhập!!");
      return;
    }
    if (loginForm.password.length <= 8) {
      pushAlert("Mật khẩu bắt buộc phải trên 8 kí tự !!");
      return;
    }
    const activeUser = storedUsers.find(
      (u) => u.email === loginForm.email && u.password === loginForm.password
    );
    if (!activeUser) {
      pushAlert("Vui lòng kiểm tra lại email hoặc mật khẩu !!");
      return;
    }
    localStorage.setItem("userActive", JSON.stringify(activeUser));
    setUserActive(activeUser);
    pushAlert("Đăng nhập thành công. Vui lòng chờ giây lát !!");
    onHandleClose();
    clearInput();
    setTimeout(() => {
      window.location.href = "/";
    }, 4000);
  }, [loginForm, storedUsers]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUserActive =
        JSON.parse(localStorage.getItem("userActive")) || {};
      setUserActive(updatedUserActive);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  //Close Login
  const onHandleClose = () => {
    setCheckLogin(false);
    setStatusUser("login");
  };
  useEffect(() => {
    const fetchMovieGenres = async () => {
      const urlGenres =
        "https://api.themoviedb.org/3/genre/movie/list?language=vi";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmFjZDNiOWY0NTJlMjE1ZGY5NzRhMjkyYzQxMmY5MSIsIm5iZiI6MTc1NDczMTQ4OS42Mywic3ViIjoiNjg5NzEzZTFkMDg3NThjYTBlMjY3NzIzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.cEm5zG-WP9ikzUMhq08tUt0XuafbfJOZUozbCYnQxas`,
        },
      };
      const res = await fetch(urlGenres, options);
      const dataGenres = await res.json();
      setDataGenres(dataGenres.genres);
      console.log(dataGenres.genres);
    };
    fetchMovieGenres();
  }, []);
  const onHandleBackLogin = () => {
    setStatusUser("login");
  };

  useEffect(() => {
    if (checkLogin) {
      // Khi login box bật thì khóa cuộn
      document.body.style.overflow = "hidden";
    } else {
      // Mở lại cuộn khi tắt login box
      document.body.style.overflow = "auto";
    }

    // cleanup khi unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [checkLogin]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(`.${cx("submenu-inner")}`) &&
        !e.target.closest("li.dropdown")
      ) {
        setCheckSubmenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const onHandleSearch = useCallback(() => {
    if (inputSearch.trim()) {
      localStorage.setItem("searchInput", JSON.stringify(inputSearch || ""));
      window.dispatchEvent(new Event("changeSearch"));
      window.location.href = `/search/${inputSearch}-result`;
    }
  }, [inputSearch]);

  const toSlug = (str) => {
    return str
      .normalize("NFD") // tách dấu
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .toLowerCase()
      .replace(/đ/g, "d") // thay đ -> d
      .replace(/[^a-z0-9\s-]/g, "") // bỏ ký tự đặc biệt
      .trim()
      .replace(/\s+/g, "-"); // thay space = -
  };

  const genresWithKey = dataGenres.map((item) => ({
    ...item,
    key: toSlug(item.name),
  }));
  console.log(genresWithKey);

  return (
    <div className={cx("Header-Wrapper", { checkHidden: checkScroll })}>
      {alerts.length > 0 && (
        <Alert alertList={alerts} setAlertList={setAlerts} />
      )}
      {checkLogin && (
        <div className={cx("include-login")}>
          {statusUser === "login" ? (
            <div className={cx("modal-content", { showModal: checkLogin })}>
              <div className={cx("close")} onClick={onHandleClose}>
                <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
              </div>
              <div className={cx("modal-left")}>
                <img src={imgLogin} alt="" />
              </div>
              <div className={cx("modal-right")}>
                <div className={cx("box")}>
                  <p className={cx("heading")}>Đăng nhập</p>
                  <p className={cx("desc")}>
                    Nếu chưa có tại khoản đăng nhập thì thực hiện{" "}
                    <span onClick={() => setStatusUser("register")}>
                      đăng ký
                    </span>{" "}
                    tại đây!!
                  </p>
                  <div className={cx("form-login")}>
                    <div className={cx("input-form")}>
                      <p>Email</p>
                      <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => onHandleInputForm(e, "login")}
                        value={loginForm.email}
                      />
                    </div>
                    <div className={cx("input-form")}>
                      <p>Mật khẩu</p>
                      <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        onChange={(e) => onHandleInputForm(e, "login")}
                        value={loginForm.password}
                      />
                    </div>
                    <button onClick={onHandleLogin}>Đăng nhập</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            statusUser === "register" && (
              <div className={cx("modal-content", { showModal: checkLogin })}>
                <div className={cx("onBack")} onClick={onHandleBackLogin}>
                  <span>
                    <FontAwesomeIcon icon={faBackward}></FontAwesomeIcon>
                  </span>
                  <span>Quay lại</span>
                </div>
                <div className={cx("close")} onClick={onHandleClose}>
                  <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                </div>
                <div className={cx("modal-left")}>
                  <img src={imgLogin} alt="" />
                </div>
                <div className={cx("modal-right")}>
                  <div className={cx("box")}>
                    <p className={cx("heading")}>Đăng ký</p>
                    <div className={cx("form-login")}>
                      <div className={cx("input-form")}>
                        <p>Username</p>
                        <input
                          type="text"
                          placeholder="Tên hiển thị"
                          name="username"
                          onChange={(e) => onHandleInputForm(e, "register")}
                          value={registerForm.username}
                        />
                      </div>
                      <div className={cx("input-form")}>
                        <p>Email</p>
                        <input
                          type="text"
                          placeholder="Email"
                          name="email"
                          onChange={(e) => onHandleInputForm(e, "register")}
                          value={registerForm.email}
                        />
                      </div>
                      <div className={cx("input-form")}>
                        <p>Mật khẩu</p>
                        <input
                          type="password"
                          placeholder="Mật khẩu"
                          name="password"
                          onChange={(e) => onHandleInputForm(e, "register")}
                          value={registerForm.password}
                        />
                      </div>
                      <div className={cx("input-form")}>
                        <p>Nhập lại</p>
                        <input
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                          name="confirmPassword"
                          onChange={(e) => onHandleInputForm(e, "register")}
                          value={registerForm.confirmPassword}
                        />
                      </div>
                      <button onClick={onHandleRegister}>Đăng ký</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
      <div className={cx("Header-inner")}>
        <img src={logo} alt="Logo" />

        <div className={cx("Header-sideBar")}>
          <ul>
            <li>
              <a href={config.routes.Home}>TRANG CHỦ</a>
            </li>

            <li className="dropdown" onClick={() => setCheckSubmenu(true)}>
              <div>
                THỂ LOẠI
                <span>
                  <FontAwesomeIcon icon={faCaretDown} />
                </span>
              </div>
              {checkSubmenu && (
                <div
                  className={cx("submenu-inner", { showSubmenu: checkSubmenu })}
                >
                  <div className={cx("submenu-list")}>
                    {genresWithKey &&
                      genresWithKey.length > 0 &&
                      genresWithKey.map((item) => (
                        <a
                          key={item.id}
                          className={cx("submenu-item")}
                          href={`/the-loai/${item.key}-genres`}
                          onClick={() => onHandleGenres(item)}
                        >
                          {item.name}
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </li>

            <li>
              <a href="/contact">GIỚI THIỆU</a>
            </li>
            <li>
              <a href="/contact">ĐĂNG KÝ HỘI VIÊN</a>
            </li>
            <li>
              <a href={config.routes.MovieUpComing}>PHIM SẮP RA MẮT</a>
            </li>
          </ul>
        </div>

        <div className={cx("Header-search")}>
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            className={cx("Header-searchInput")}
            onChange={(e) => setInputSearch(e.target.value)}
            value={inputSearch}
          />
          <button
            className={cx("Header-searchButton")}
            onClick={onHandleSearch}
          >
            Search
          </button>
        </div>
        <div className={cx("user-form")}>
          {userActive && Object.keys(userActive).length > 0 ? (
            <Menu menuData={userMenu}>
              <div className={cx("user-box")}>
                <div className={cx("avatar-logo")}>
                  <img src={userActive.avatar || avatarNull} alt="" />
                </div>
              </div>
            </Menu>
          ) : (
            <button
              className={cx("login-user")}
              onClick={() => setCheckLogin(true)}
            >
              Thành viên
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
