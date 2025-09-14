import classNames from "classnames/bind";
import styles from "./ListMovieContent.module.scss";
import PropTypes from "prop-types";
import { config } from "../../config";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import { useLocation } from "react-router-dom";

const cx = classNames.bind(styles);

function ListMovieContent({
  data = [],
  title,
  page,
  large,
  showPaginationPage,
  showButton,
  search,
}) {
  const [activeMovie, setActiveMovie] = useState({});
  let [pageCount, setPageCount] = useState(1); // trang hiện tại
  let [pageTotal, setPageTotal] = useState(0); // tổng số trang
  let [pageRange, setPageRange] = useState([1, 9]); // khoảng trang đang hiển thị
  const [loading, setLoading] = useState(false);
  const [delayData, setDelayData] = useState(data || []);
  const { pathname } = useLocation();

  //Delay data
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDelayData(data);
      setLoading(true);
    }, 1000);
    return () => {
      clearTimeout(timeOut);
    };
  }, [data]);
  //Quay về trang đầu khi load trang
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false);
  }, [pageCount]);
  const onHandleView = () => {
    const listNew = {
      title,
      data,
    };
    localStorage.setItem("viewGenresAll", JSON.stringify(listNew));
  };
  useEffect(() => {
    setPageTotal(page);
  }, [page]);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("pageChange", { detail: pageCount }));
  }, [pageCount]);
  const onHandleMovie = (item) => {
    setActiveMovie(item);
  };

  const renderPages = () => {
    let pages = [];
    for (let i = pageRange[0]; i <= Math.min(pageRange[1], pageTotal); i++) {
      pages.push(
        <div
          key={i}
          onClick={() => setPageCount(i)}
          className={cx("page-count-item", { activePage: i === pageCount })}
        >
          {i}
        </div>
      );
    }
    return pages;
  };
  const handleNext = () => {
    if (pageRange[1] < pageTotal) {
      setPageRange([pageRange[0] + 9, pageRange[1] + 9]);
    }
  };

  const handlePrev = () => {
    if (pageRange[0] > 1) {
      setPageRange([pageRange[0] - 9, pageRange[1] - 9]);
    }
  };
  useEffect(() => {
    if (Object.keys(activeMovie).length > 0) {
      localStorage.setItem("selectedMovie", JSON.stringify(activeMovie));
    }
  }, [activeMovie]);

  return (
    <div className={cx("ListMovieContent-Wrapper")}>
      {showButton && <div className={cx("border-top")}></div>}
      {!loading ? (
        <div className={cx("loading")}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : (
        <div className={cx("ListMovieContent-inner")}>
          {title && (
            <div className={cx("ListMovieContent-top", { searchAct: search })}>
              <p className={cx("ListMovieContent-top__heading")}>{title}</p>
              {search && <span className={cx("search")}>{search || ""}</span>}
              {showButton && (
                <Button
                  to={`${config.routes.MovieAll}`}
                  className={cx("act")}
                  onClick={onHandleView}
                >
                  Xem tất cả
                </Button>
              )}
            </div>
          )}
          <div className={cx("ListMovieContent-list", { activeLarge: large })}>
            {data && data.length > 0 ? (
              data.map((item) => {
                if (!item.poster_path) return null;
                return (
                  <a
                    href={`/chi-tiet/${item.title?.replace(/\s+/g, "")}-phim`}
                    key={item.id}
                    className={cx("listMovie-item", {
                      listMovieItem__large: large,
                    })}
                    onClick={() => onHandleMovie(item)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title}
                      className={cx("listMovie-item__img")}
                    />
                    <div className={cx("listMovie-item__info")}>
                      <p className={cx("listMovie-item__title")}>
                        {item.title}
                      </p>
                      <p className={cx("listMovie-item__original_title")}>
                        {item.original_title}
                      </p>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className={cx("box")}>
                {search && (
                  <div className={cx("empty")}>
                    Không có kết quả vui lòng thử lại !!
                  </div>
                )}
              </div>
            )}
            {showPaginationPage && data.length > 0 && pageTotal > 1 && (
              <div className={cx("list-page")}>
                <div className={cx("prev-page", "icon")} onClick={handlePrev}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </div>

                <div className={cx("list-count")}>
                  <div className={cx("list-count-page")}>{renderPages()}</div>
                </div>

                <div className={cx("next-page", "icon")} onClick={handleNext}>
                  <FontAwesomeIcon icon={faAnglesRight} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ListMovieContent.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  page: PropTypes.number,
};

export default ListMovieContent;
