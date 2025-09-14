import classNames from "classnames/bind";
import styles from "./MovieUserContent.module.scss";
import PropTypes from "prop-types";
import { config } from "../../config";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import { Alert } from "..";

const cx = classNames.bind(styles);

// Hàm tạo slug có thể tái sử dụng
const toSlug = (str) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

function MovieUserContent({
  data = [],
  title,
  large,
  showButton,
  favorite,
  playlist,
  selectIdx,
}) {
  const [activeMovie, setActiveMovie] = useState({});
  const [dataUpdate, setDataUpdate] = useState([]);
  const [userActive, setUserActive] = useState(
    () => JSON.parse(localStorage.getItem("userActive")) || {}
  );
  const [listAccount, setListAccount] = useState(
    () => JSON.parse(localStorage.getItem("listUserAccount")) || []
  );
  const [delayedData, setDelayedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Memo tránh tính lại không cần thiết
  const movieWithKey = useMemo(
    () => dataUpdate.map((item) => ({ ...item, key: toSlug(item.title) })),
    [dataUpdate]
  );

  const pushAlert = useCallback((msg) => {
    setAlerts((prev) => [...prev, { id: Date.now(), message: msg }]);
  }, []);

  // Delay loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDelayedData(movieWithKey);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [movieWithKey]);

  // Chỉ chạy khi userActive thay đổi
  useEffect(() => {
    if (favorite && userActive) {
      setDataUpdate(userActive.storedMovies || []);
    }
  }, [favorite, userActive]);

  // Chỉ chạy khi playlist thay đổi
  useEffect(() => {
    if (playlist) {
      setDataUpdate(data?.[selectIdx]?.movies || []);
    }
  }, [playlist, selectIdx, data]);

  // Mặc định
  useEffect(() => {
    if (!favorite && !playlist) {
      setDataUpdate(data || []);
    }
  }, [data, favorite, playlist]);

  // Lắng nghe xoá playlist từ nơi khác
  useEffect(() => {
    const handleStorage = () => {
      const updatedUserActive =
        JSON.parse(localStorage.getItem("userActive")) || {};
      setDataUpdate(updatedUserActive.storedPlayList || []);
    };
    window.addEventListener("deletePlayList", handleStorage);
    return () => window.removeEventListener("deletePlayList", handleStorage);
  }, []);

  // Lưu phim đang chọn
  useEffect(() => {
    if (Object.keys(activeMovie).length > 0) {
      localStorage.setItem("selectedMovie", JSON.stringify(activeMovie));
    }
  }, [activeMovie]);

  // Xoá phim
  const onHandleDelete = useCallback(
    (idx) => {
      let newUpdate = { ...userActive };
      let newData = dataUpdate;

      if (favorite) {
        newData = dataUpdate.filter((_, i) => i !== idx);
        newUpdate.storedMovies = newData;
        pushAlert("Đã xoá khỏi danh sách phim yêu thích !!");
      } else if (playlist) {
        const updatedPlayList = userActive.storedPlayList.map((pl, i) =>
          i === selectIdx
            ? { ...pl, movies: pl.movies.filter((_, j) => j !== idx) }
            : pl
        );
        newData = updatedPlayList[selectIdx]?.movies || [];
        newUpdate.storedPlayList = updatedPlayList;
        pushAlert("Đã xoá phim khỏi danh sách !!");
      } else {
        newData = dataUpdate.filter((_, i) => i !== idx);
      }

      setUserActive(newUpdate);
      setDataUpdate(newData);
      localStorage.setItem("userActive", JSON.stringify(newUpdate));

      const newListAccount = listAccount.map((item) =>
        item.email === userActive.email ? newUpdate : item
      );
      setListAccount(newListAccount);
      localStorage.setItem("listUserAccount", JSON.stringify(newListAccount));

      window.dispatchEvent(new Event("storage"));
    },
    [
      favorite,
      playlist,
      selectIdx,
      dataUpdate,
      userActive,
      listAccount,
      pushAlert,
    ]
  );

  const onHandleView = useCallback(() => {
    localStorage.setItem("viewGenresAll", JSON.stringify({ title, data }));
  }, [title, data]);

  const renderResult = useCallback(
    (item, idx) => (
      <div
        key={item.id}
        className={cx("listMovie-item", { listMovieItem__large: large })}
      >
        <div className={cx("delete-item")} onClick={() => onHandleDelete(idx)}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <a
          href={`/chi-tiet/${item.key}-movie`}
          onClick={() => setActiveMovie(item)}
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
            alt={item.title}
            className={cx("listMovie-item__img")}
          />
          <div className={cx("listMovie-item__info")}>
            <p className={cx("listMovie-item__title")}>{item.title}</p>
            <p className={cx("listMovie-item__original_title")}>
              {item.original_title}
            </p>
          </div>
        </a>
      </div>
    ),
    [large, onHandleDelete]
  );

  return (
    <div className={cx("MovieUserContent-Wrapper")}>
      <Alert setAlertList={setAlerts} alertList={alerts} />
      {showButton && <div className={cx("border-top")} />}
      <div className={cx("MovieUserContent-inner")}>
        {title && (
          <div className={cx("MovieUserContent-top")}>
            <p className={cx("MovieUserContent-top__heading")}>{title}</p>
            {showButton && (
              <Button
                to={config.routes.MovieAll}
                className={cx("act")}
                onClick={onHandleView}
              >
                Xem tất cả
              </Button>
            )}
          </div>
        )}
        <div className={cx("MovieUserContent-list", { activeLarge: large })}>
          {loading ? (
            <div className={cx("loading")}>
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            </div>
          ) : delayedData?.length > 0 ? (
            delayedData.map(
              (item, idx) => item.poster_path && renderResult(item, idx)
            )
          ) : (
            <div className={cx("empty")}></div>
          )}
        </div>
      </div>
    </div>
  );
}

MovieUserContent.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  page: PropTypes.number,
};

export default MovieUserContent;
