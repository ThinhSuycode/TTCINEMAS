import classNames from "classnames/bind";
import styles from "./ListMovieContent.module.scss";
import PropTypes from "prop-types";
import { config } from "../../config";
import { useState, useEffect, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";

const cx = classNames.bind(styles);

function ListMovieContent({
  data = [],
  title,
  page,
  large,
  showPaginationPage,
  showButton,
}) {
  const [activeMovie, setActiveMovie] = useState({});
  let [pageCount, setPageCount] = useState(1); // trang hiện tại
  let [pageTotal, setPageTotal] = useState(0); // tổng số trang
  let [pageRange, setPageRange] = useState([1, 9]); // khoảng trang đang hiển thị
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
      <div className={cx("ListMovieContent-inner")}>
        {title && (
          <div className={cx("ListMovieContent-top")}>
            <p className={cx("ListMovieContent-top__heading")}>{title}</p>
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
          {data.map((item) => {
            if (!item.poster_path) return null;
            return (
              <a
                href={config.routes.MovieDetail}
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
                  <p className={cx("listMovie-item__title")}>{item.title}</p>
                  <p className={cx("listMovie-item__original_title")}>
                    {item.original_title}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
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
  );
}

ListMovieContent.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  page: PropTypes.number,
};

export default ListMovieContent;
