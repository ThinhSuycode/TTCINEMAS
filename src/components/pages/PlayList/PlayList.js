import classNames from "classnames/bind";
import styles from "./PlayList.module.scss";
import Button from "../../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClose,
  faPlayCircle,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import MovieUserContent from "../../MovieUserContent/MovieUserContent";
import { Alert } from "../..";
const cx = classNames.bind(styles);
function PlayList() {
  const refInput = useRef();
  const [selectIdx, setSelectIdx] = useState(null);
  const [inputPlayListEdit, setInputPlayListEdit] = useState("");
  const [inputPlayListAdd, setInputPlayListAdd] = useState("");
  const [statusPlayList, setStatusPlayList] = useState("");
  const [selectMovie, setSelectMovie] = useState(null);

  const [userActive, setUserActive] = useState(
    () => JSON.parse(localStorage.getItem("userActive")) || {}
  );
  // Dùng useMemo để tránh khởi tạo lại mỗi lần render
  const listAccount = useMemo(() => {
    return JSON.parse(localStorage.getItem("listUserAccount")) || [];
  }, []);
  const [alerts, setAlerts] = useState([]);

  //Thực hiện push alerts

  const pushAlert = (msg) => {
    const id = Math.floor(Math.random() * 10000);
    setAlerts((prev) => [...prev, { id, message: msg }]);
  };

  const onHandleEdit = useCallback(
    (idx) => {
      setStatusPlayList("edit");
      setSelectIdx(idx);
      setInputPlayListEdit(userActive.storedPlayList[idx].name);
    },
    [userActive]
  );
  //Delay kết quả khi click vào danh mục

  useEffect(() => {
    if (
      statusPlayList === "edit" &&
      userActive.storedPlayList &&
      userActive.storedPlayList[selectIdx]
    ) {
      setInputPlayListEdit(userActive.storedPlayList[selectIdx].name);
    }
  }, [statusPlayList, selectIdx, userActive.storedPlayList]);

  const onChangeInput = useCallback((e) => {
    setInputPlayListAdd(e);
  }, []);
  useEffect(() => {
    const handleStorage = () => {
      const updatedUserActive =
        JSON.parse(localStorage.getItem("userActive")) || {};
      setUserActive(updatedUserActive);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  useEffect(() => {
    if (
      statusPlayList === "add" ||
      (statusPlayList === "edit" && refInput.current)
    ) {
      refInput.current.focus();
    }
  }, [statusPlayList]);

  const onHandleClose = useCallback(() => {
    setInputPlayListAdd("");
    setStatusPlayList("");
  }, []);
  // Thêm mới playlist, mỗi playlist là object { name, movies: [] }
  const onHandleAdd = useCallback(() => {
    if (!inputPlayListAdd.trim()) {
      pushAlert("Tên danh sách không được để trống!");
      return;
    }
    if (
      userActive.storedPlayList
        .map((item) => item.name)
        .includes(inputPlayListAdd.trim())
    ) {
      pushAlert("Đã trùng tên trong danh sách lưu của bạn!!");
      setInputPlayListAdd("");
      return;
    }
    const newPlayListArr = [
      ...(userActive.storedPlayList || []),
      { name: inputPlayListAdd.trim(), movies: [] },
    ];
    const newPlayList = {
      ...userActive,
      storedPlayList: newPlayListArr,
    };

    localStorage.setItem("userActive", JSON.stringify(newPlayList));
    localStorage.setItem(
      "listUserAccount",
      JSON.stringify(
        listAccount.map((item) =>
          item.email === userActive.email ? newPlayList : item
        )
      )
    );
    setUserActive(newPlayList);
    pushAlert("Thêm thành công !!");
    onHandleClose();
  }, [inputPlayListAdd, userActive, listAccount, onHandleClose]);
  // Sửa tên playlist
  const onHandleSave = useCallback(() => {
    if (!inputPlayListEdit.trim()) {
      pushAlert("Tên danh sách không được để trống!");
      return;
    }

    const isDuplicate = userActive.storedPlayList.some(
      (item, idx) => item.name === inputPlayListEdit.trim() && idx !== selectIdx
    );

    if (!isDuplicate) {
      const updatedPlayList = userActive.storedPlayList.map((item, idx) =>
        idx === selectIdx ? { ...item, name: inputPlayListEdit } : item
      );
      const updatedUserActive = {
        ...userActive,
        storedPlayList: updatedPlayList,
      };
      localStorage.setItem("userActive", JSON.stringify(updatedUserActive));
      localStorage.setItem(
        "listUserAccount",
        JSON.stringify(
          listAccount.map((item) =>
            item.email === userActive.email ? updatedUserActive : item
          )
        )
      );
      setUserActive(updatedUserActive);
      pushAlert("Sửa thành công!!");
      onHandleClose();
    } else {
      pushAlert("Đã trùng tên trong danh sách lưu của bạn!!");
      setInputPlayListEdit(userActive.storedPlayList[selectIdx].name);
      return;
    }
  }, [inputPlayListEdit, userActive, selectIdx, listAccount, onHandleClose]);

  useEffect(() => {
    localStorage.setItem(
      "listUserAccount",
      JSON.stringify(
        listAccount.map((item) =>
          item.email === userActive.email ? userActive : item
        )
      )
    );
  }, [userActive, listAccount]);
  // Xoá playlist

  const onHandleDelete = useCallback(() => {
    const updatedPlayList = userActive.storedPlayList.filter(
      (_, idx) => idx !== selectIdx
    );
    const updatedUserActive = {
      ...userActive,
      storedPlayList: updatedPlayList,
    };
    localStorage.setItem("userActive", JSON.stringify(updatedUserActive));

    localStorage.setItem(
      "listUserAccount",
      JSON.stringify(
        listAccount.map((item) =>
          item.email === userActive.email ? updatedUserActive : item
        )
      )
    );
    setUserActive(updatedUserActive);
    window.dispatchEvent(new Event("deletePlayList")); // Gửi sự kiện storage để các tab khác nhận biết thay đổi
    pushAlert("Xoá thành công!!");
    onHandleClose();
  }, [userActive, selectIdx, listAccount, onHandleClose]);

  return (
    <div className={cx("PlayList-Wrapper")}>
      <Alert alertList={alerts} setAlertList={setAlerts}></Alert>
      {statusPlayList === "add" ? (
        <div className={cx("include-box")}>
          <div className={cx("modal-content")}>
            <p className={cx("heading")}>Thêm danh sách mới</p>
            <input
              type="text"
              placeholder="Tên danh sách"
              ref={refInput}
              onChange={(e) => onChangeInput(e.target.value)}
              value={inputPlayListAdd}
            />
            <div className={cx("footer-modal")}>
              <button className={cx("addPlayList")} onClick={onHandleAdd}>
                <span>
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                </span>
                <span>Thêm</span>
              </button>
              <button className={cx("closePlayList")} onClick={onHandleClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : (
        statusPlayList === "edit" && (
          <div className={cx("include-box")}>
            <div className={cx("modal-content")}>
              <div className={cx("include-box")}>
                <div className={cx("modal-content")}>
                  <div
                    className={cx("close")}
                    onClick={() => setStatusPlayList("")}
                  >
                    <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
                  </div>
                  <p className={cx("heading")}>Cập nhật PlayList</p>
                  <input
                    type="text"
                    ref={refInput}
                    onChange={(e) => setInputPlayListEdit(e.target.value)}
                    value={inputPlayListEdit}
                  />
                  <div className={cx("footer-modal")}>
                    <button
                      className={cx("savePlayList")}
                      onClick={onHandleSave}
                    >
                      <span>
                        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                      </span>
                      <span>Lưu</span>
                    </button>
                    <button
                      className={cx("deletePlayList")}
                      onClick={onHandleDelete}
                    >
                      <span>
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                      </span>
                      <span>Xoá</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      <div className={cx("PlayList-inner")}>
        <h3 className={cx("PlayList__heading")}>Danh sách</h3>
        <div className={cx("PlayList-act")}>
          <Button
            iconLeft={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}
            onClick={() => setStatusPlayList("add")}
          >
            Thêm mới
          </Button>
        </div>
        <div className={cx("PlayList-content")}>
          <div className={cx("PlayList-nameGenres")}>
            {userActive.storedPlayList &&
            userActive.storedPlayList.length > 0 ? (
              userActive.storedPlayList.map((item, idx) => (
                <div
                  key={idx}
                  className={cx("PlayList-item", {
                    activeItem: selectMovie === idx,
                  })}
                  onClick={() => setSelectMovie(idx)}
                >
                  <p>{item.name}</p>
                  <div className={cx("footer-playList")}>
                    <div className={cx("footer-left")}>
                      <span>
                        <FontAwesomeIcon icon={faPlayCircle}></FontAwesomeIcon>
                      </span>
                      <span>{item.movies.length} phim</span>
                    </div>
                    <div
                      className={cx("footer-right")}
                      onClick={() => onHandleEdit(idx)}
                    >
                      Sửa
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={cx("empty")}>Bạn chưa có danh sách nào</div>
            )}
          </div>
          <div className={cx("PlayList-movies")}>
            <MovieUserContent
              data={userActive.storedPlayList}
              playlist
              selectIdx={selectMovie}
            ></MovieUserContent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayList;
