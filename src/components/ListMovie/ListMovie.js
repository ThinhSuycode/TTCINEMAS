import classNames from "classnames/bind";
import styles from "./ListMovie.module.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 10 },
  desktop: { breakpoint: { max: 3000, min: 1200 }, items: 7 },
  tablet: { breakpoint: { max: 1200, min: 600 }, items: 3 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 2 },
};

function ListMovie({ title, data = [] }) {
  const [activeMovieList, setActiveMovieList] = useState({});

  const onHandleMovieList = (item) => {
    setActiveMovieList(item);
  };
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

  const movieWithKey = data.map((item) => ({
    ...item,
    key: toSlug(item.title),
  }));

  console.log(movieWithKey);
  useEffect(() => {
    if (Object.keys(activeMovieList).length > 0) {
      localStorage.setItem("selectedMovie", JSON.stringify(activeMovieList));
    }
  }, [activeMovieList]);

  return (
    <div className={cx("movie-inner")}>
      <p className={cx("movie-heading")}>{title}</p>
      <Carousel responsive={responsive} className={cx("list-movie")}>
        {movieWithKey.map((item) => {
          if (!item.poster_path) return null;
          return (
            <a
              href={`/chi-tiet/${item.key}-movie`}
              className={cx("movie-item")}
              key={item.id}
              onClick={() => onHandleMovieList(item)}
            >
              <div className={cx("hidden-item")}></div>
              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title}
              />
              <p className={cx("movie-item-title")}>{item.title}</p>
            </a>
          );
        })}
      </Carousel>
    </div>
  );
}

ListMovie.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

export default ListMovie;
