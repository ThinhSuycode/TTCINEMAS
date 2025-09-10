import classNames from "classnames/bind";
import styles from "./MovieUserContent.module.scss";
import PropTypes from "prop-types";
import { config } from "../../config";
import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function MovieUserContent({
  data = [],
  title,
  page,
  large,
  showPaginationPage,
  showButton,
  favorite,
  playlist,
  selectIdx,
}) {
  const [activeMovie, setActiveMovie] = useState({});
  const [pageCount, setPageCount] = useState(1);
  const [pageTotal, setPageTotal] = useState(0);
  const [pageRange, setPageRange] = useState([1, 9]);
  const [dataUpdate, setDataUpdate] = useState([]);
  const [userActive, setUserActive] = useState(
    () => JSON.parse(localStorage.getItem("userActive")) || {}
  );
  const [listAccount, setListAccount] = useState(
    () => JSON.parse(localStorage.getItem("listUserAccount")) || []
  );
  const [delayedData, setDelayedData] = useState([]);

  const [loading, setLoading] = useState(false);

  // Delay 1s khi dataUpdate thay đổi và show loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDelayedData(dataUpdate);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dataUpdate]);
  const renderResult = (item, idx) => (
    <div
      key={item.id}
      className={cx("listMovie-item", {
        listMovieItem__large: large,
      })}
    >
      <div className={cx("delete-item")} onClick={() => onHandleDelete(idx)}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <a href={config.routes.MovieDetail} onClick={() => setActiveMovie(item)}>
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
  );
  useEffect(() => {
    const handleStorage = () => {
      const updatedUserActive =
        JSON.parse(localStorage.getItem("userActive")) || {};
      setDataUpdate(updatedUserActive.storedPlayList || []);
    };
    window.addEventListener("deletePlayList", handleStorage);
    return () => window.removeEventListener("deletePlayList", handleStorage);
  }, []);
  // Cập nhật dataUpdate theo loại hiển thị
  useEffect(() => {
    if (favorite) {
      setDataUpdate(userActive.storedMovies || []);
    } else if (playlist) {
      setDataUpdate(data?.[selectIdx]?.movies || []);
    } else {
      setDataUpdate(data || []);
    }
  }, [favorite, playlist, selectIdx]);

  useEffect(() => {
    setPageTotal(page || 0);
  }, [page]);

  // Lưu phim đang chọn vào localStorage
  useEffect(() => {
    if (Object.keys(activeMovie).length > 0) {
      localStorage.setItem("selectedMovie", JSON.stringify(activeMovie));
    }
  }, [activeMovie]);

  // Xoá phim khỏi danh sách (favorite hoặc playlist)
  const onHandleDelete = useCallback(
    (idx) => {
      let newData;
      let newUpdate;
      if (favorite) {
        newData = dataUpdate.filter((_, i) => idx !== i);
        newUpdate = { ...userActive, storedMovies: newData };
        setUserActive(newUpdate);
        setDataUpdate(newData);
      } else if (playlist) {
        const updatedPlayList = userActive.storedPlayList.map((pl, i) =>
          i === selectIdx
            ? { ...pl, movies: pl.movies.filter((_, j) => j !== idx) }
            : pl
        );
        newData = updatedPlayList[selectIdx]?.movies || [];
        newUpdate = { ...userActive, storedPlayList: updatedPlayList };
        setUserActive(newUpdate);
        setDataUpdate(newData);
      } else {
        newData = dataUpdate.filter((_, i) => idx !== i);
        setDataUpdate(newData);
        return;
      }
      localStorage.setItem("userActive", JSON.stringify(newUpdate));
      const newListAccount = listAccount.map((item) =>
        item.email === userActive.email ? newUpdate : item
      );
      window.dispatchEvent(new Event("storage"));
      setListAccount(newListAccount);
      localStorage.setItem("listUserAccount", JSON.stringify(newListAccount));
    },
    [favorite, playlist, selectIdx, dataUpdate, userActive, listAccount]
  );

  const onHandleView = useCallback(() => {
    const listNew = { title, data };
    localStorage.setItem("viewGenresAll", JSON.stringify(listNew));
  }, [title, data]);

  // Gửi sự kiện khi đổi trang
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("pageChange", { detail: pageCount }));
  }, [pageCount]);

  return (
    <div className={cx("MovieUserContent-Wrapper")}>
      {showButton && <div className={cx("border-top")}></div>}
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
          ) : Array.isArray(delayedData) && delayedData.length > 0 ? (
            delayedData.map((item, idx) => {
              if (!item.poster_path) return null;
              return renderResult(item, idx);
            })
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
