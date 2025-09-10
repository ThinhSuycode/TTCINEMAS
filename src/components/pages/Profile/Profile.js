import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Button from "../../Button";
import avatar from "../../../assets/icon/vietnam.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faGrip } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useCallback } from "react";
import logo1 from "../../../assets/logo/logo1.jpg";
import logoVn1 from "../../../assets/icon/vietnam.jpg";
import logoVn2 from "../../../assets/logo/logoVn2.jpg";
import logoVn3 from "../../../assets/logo/logoVN3.jpg";
import logoAnime1 from "../../../assets/logo/logoAnime1.jpg";
import logoAnime2 from "../../../assets/logo/logoAnime2.jpg";
import logoMeme1 from "../../../assets/logo/logoMeme1.jpg";
import logoMeme2 from "../../../assets/logo/logoMeme2.jpg";

const cx = classNames.bind(styles);

const listLogo = [
  {
    title: "Hoạt hình",
    img: [logoAnime1, logoAnime2],
  },
  {
    title: "Việt Nam",
    img: [logoVn1, logoVn2, logoVn3],
  },
  {
    title: "Nhật bản",
    img: [logo1, logo1, logo1],
  },
  {
    title: "Cầu thủ",
    img: [logo1, logo1, logo1],
  },
  {
    title: "Meme",
    img: [logoMeme1, logoMeme2],
  },
];

function Profile() {
  const [storedUsers, setStoredUsers] = useState(
    JSON.parse(localStorage.getItem("userActive")) || {}
  );
  const listAccount = localStorage.getItem("listUserAccount")
    ? JSON.parse(localStorage.getItem("listUserAccount"))
    : [];
  const [selectLogoIdx, setSelectLogoIdx] = useState(0);
  const [selectLogoItemIdx, setSelectLogoItemIdx] = useState(null);
  const [selectLogoItemSrc, setSelectLogoItemSrc] = useState("");
  const [updateInfo, setUpdateInfo] = useState({
    email: storedUsers.email || "",
    username: storedUsers.username || "",
    numberPhone: storedUsers.numberPhone || "",
    gender: storedUsers.gender || "",
    avatar: storedUsers.avatarUser || "",
  });
  const [activeChooseLogo, setActiveChooseLogo] = useState(false);

  //Lưu dữ liệu lại khi thay đổi
  useEffect(() => {
    const dataUsers = JSON.parse(localStorage.getItem("userActive")) || {};
    setStoredUsers(dataUsers);
  }, []);

  const onHandleImg = (img, idx) => {
    setSelectLogoItemIdx(idx);
    setSelectLogoItemSrc(img);
  };

  //Save logo mới
  const onSaveLogo = useCallback(() => {
    const newUpdate = {
      ...storedUsers,
      avatar: selectLogoItemSrc,
    };
    setStoredUsers(newUpdate);
    localStorage.setItem("userActive", JSON.stringify(newUpdate));
    localStorage.setItem(
      "listUserAccount",
      JSON.stringify(
        listAccount.map((el) =>
          el.email === storedUsers.email ? newUpdate : el
        )
      )
    );
    alert("Cập nhật thành công !!");
    setActiveChooseLogo(false);
    window.dispatchEvent(new Event("storage")); //Gọi sự kiện storage để các component khác nhận biết được sự thay đổi
  }, [selectLogoItemSrc, storedUsers, listAccount]);

  const onHandleChange = useCallback((e) => {
    const { name, value } = e.target;
    setUpdateInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {}, [storedUsers]);
  const onHandleUpdate = useCallback(() => {
    if (!updateInfo.username.trim()) {
      alert("Vui lòng nhập username để thực hiện cập nhật !!");
      return;
    }
    if (!updateInfo.numberPhone.trim()) {
      alert("Vui lòng nhập số điện thoại để thực hiện cập nhật !!");
      return;
    }
    if (!/^\d{10}$/.test(updateInfo.numberPhone)) {
      alert("Số điện thoại phải gồm đúng 10 chữ số !!");
      return;
    }
    const updateInfoUser = {
      ...storedUsers,
      email: updateInfo.email || "",
      username: updateInfo.username || "",
      numberPhone: updateInfo.numberPhone || "",
      gender: updateInfo.gender || "",
    };
    localStorage.setItem("userActive", JSON.stringify(updateInfoUser));
    localStorage.setItem(
      "listUserAccount",
      JSON.stringify(
        listAccount.map((acc) =>
          acc.email === updateInfo.email ? updateInfoUser : acc
        )
      )
    );
    setUpdateInfo({ ...updateInfo });
    alert("Cập nhật thành công !!");
  }, [updateInfo, listAccount, storedUsers]);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userActive"));
    if (saved) {
      setUpdateInfo({
        email: saved.email || "",
        username: saved.username || "",
        numberPhone: saved.numberPhone || "",
        gender: saved.gender || "",
        avatar: saved.avatarUser || "",
      });
    }
  }, []);
  const onChangeLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024) {
        alert("Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn 100KB!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectLogoItemSrc(ev.target.result);
        const newUser = {
          ...storedUsers,
          avatar: ev.target.result,
        };
        localStorage.setItem("userActive", JSON.stringify(newUser));
        localStorage.setItem(
          "listUserAccount",
          JSON.stringify(
            listAccount.map((el) =>
              el.email === storedUsers.email ? newUser : el
            )
          )
        );
      };
      reader.readAsDataURL(file);
      alert("Cập nhật ảnh đại diện thành công !!");
      window.dispatchEvent(new Event("storage")); //Gọi sự kiện storage để các component khác nhận biết được sự thay đổi
    }
  };

  return (
    <div className={cx("Profile-Wrapper")}>
      <div className={cx("Profile-inner")}>
        <h3 className={cx("Profile-heading")}>Tài Khoản</h3>
        <p className={cx("Profile-desc")}>Cập nhật thông tin tài khoản</p>
        <div className={cx("Profile-list")}>
          <div className={cx("Profile-left")}>
            <form className={cx("form-user")}>
              <div className={cx("input-form")}>
                <p>Email</p>
                <input
                  className={cx("email")}
                  type="email"
                  value={updateInfo.email}
                  readOnly
                />
              </div>
              <div className={cx("input-form")}>
                <p>Tên hiển thị</p>
                <input
                  type="text"
                  name="username"
                  value={updateInfo.username}
                  onChange={onHandleChange}
                  placeholder="Vui lòng cập nhật >>>"
                />
              </div>
              <div className={cx("input-form")}>
                <p>Số điện thoại</p>
                <input
                  type="tel"
                  name="numberPhone"
                  value={updateInfo.numberPhone}
                  onChange={onHandleChange}
                  placeholder="Vui lòng cập nhật >>>"
                />
              </div>
              <div className={cx("gender")}>
                <p>Giới tính</p>
                <div className={cx("form-gender")}>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={updateInfo.gender === "male"}
                      onChange={onHandleChange}
                    />
                    <span> Nam</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={updateInfo.gender === "female"}
                      onChange={onHandleChange}
                    />
                    <span>Nữ</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={updateInfo.gender === "other"}
                      onChange={onHandleChange}
                    />
                    <span>Không xác định</span>
                  </label>
                </div>
              </div>
            </form>
            <div className={cx("Profile-leftAct")}>
              <Button onClick={onHandleUpdate}>Cập nhật</Button>
            </div>
          </div>
          <div className={cx("Profile-right")}>
            <div className={cx("logo-user")}>
              <img src={storedUsers.avatar || logoVn1} alt="avatar" />
            </div>
            <div
              className={cx("list-logo")}
              onClick={() => setActiveChooseLogo(true)}
            >
              <span>
                <FontAwesomeIcon icon={faGrip} />
              </span>
              <span>Ảnh có sẵn</span>
            </div>
            <div className={cx("box-imgChange")}>
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => onChangeLogo(e)}
                id="changeLogo"
              />
              <label htmlFor="changeLogo">Ảnh máy tính</label>
            </div>
          </div>
          {activeChooseLogo && (
            <div className={cx("include-box")}>
              <div className={cx("modal-logo")}>
                <div
                  className={cx("close-modal")}
                  onClick={() => setActiveChooseLogo(false)}
                >
                  <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                </div>
                <div className={cx("modal-logo__heading")}>
                  Đổi ảnh đại diện
                </div>
                <div className={cx("modal-logo__content")}>
                  <div className={cx("nav-menu")}>
                    {listLogo ? (
                      listLogo.map((item, idx) => (
                        <div
                          key={idx}
                          className={cx("menu-item", {
                            active: selectLogoIdx === idx,
                          })}
                          onClick={() => setSelectLogoIdx(idx)}
                        >
                          {item.title}
                        </div>
                      ))
                    ) : (
                      <div>Dữ liệu bị lỗi!!</div>
                    )}
                  </div>
                  <div className={cx("list-logo")}>
                    {listLogo ? (
                      (listLogo[selectLogoIdx].img || []).map((item, idx) => (
                        <div
                          key={idx}
                          className={cx("logo-item", {
                            activeItem: idx === selectLogoItemIdx,
                          })}
                          onClick={() => onHandleImg(item, idx)}
                        >
                          <img src={item} alt="" />
                        </div>
                      ))
                    ) : (
                      <div>Lỗi logo chưa có dữ liệu !!</div>
                    )}
                  </div>
                  <div className={cx("list-act")}>
                    <button className={cx("save")} onClick={onSaveLogo}>
                      Lưu
                    </button>
                    <button
                      className={cx("close")}
                      onClick={() => setActiveChooseLogo(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
