import classNames from "classnames/bind";
import styles from "./ListMovieSideBar.module.scss";
import PropType from "prop-types";
import { useEffect, useState } from "react";
import { config } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as starNull } from "@fortawesome/free-regular-svg-icons";

const cx = classNames.bind(styles);

function ListMovieSideBar({ title, data = [] }) {
  const [activeMovie, setActiveMovie] = useState({});
  const onHandleSideBar = (item) => {
    setActiveMovie(item);
  };
  useEffect(() => {
    if (Object.keys(activeMovie).length > 0) {
      localStorage.setItem("selectedMovie", JSON.stringify(activeMovie));
    }
  }, [activeMovie]);
  return (
    <div className={cx("ListMovieSideBar-Wrapper")}>
      <div className={cx("ListMovieSideBar-inner")}>
        <p className={cx("movie-heading")}>{title}</p>
        <div className={cx("ListMovieSideBar")}>
          {data.map((item) => (
            <a
              href={config.routes.MovieDetail}
              key={item.id}
              className={cx("movieTrending-item")}
              onClick={() => onHandleSideBar(item)}
            >
              <div className={cx("movie-img")}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt=""
                />
              </div>
              <div className={cx("movieTrending-info")}>
                <p className={cx("title")}>{item.title}</p>
                <p className={cx("release_date")}>
                  {new Date(item.release_date).toLocaleDateString("vi-VN")}
                </p>
                <p className={cx("rate")}>
                  <span>Rate: </span>
                  <span>
                    {(() => {
                      const stars = [];
                      const fullStars = Math.floor(item.vote_average);
                      const hasHalfStar = item.vote_average % 1 >= 0.5;
                      const emptyStars = 10 - fullStars - (hasHalfStar ? 1 : 0);

                      for (let i = 0; i < fullStars; i++) {
                        stars.push(
                          <span key={`full-${i}`} className={cx("icon-start")}>
                            <FontAwesomeIcon
                              icon={faStar}
                              className={cx("icon")}
                            ></FontAwesomeIcon>
                          </span>
                        );
                      }

                      if (hasHalfStar) {
                        stars.push(
                          <span key="half" className={cx("icon-start")}>
                            <FontAwesomeIcon
                              icon={faStarHalfStroke}
                              className={cx("icon")}
                            ></FontAwesomeIcon>
                          </span>
                        );
                      }

                      for (let i = 0; i < emptyStars; i++) {
                        stars.push(
                          <span key={`empty-${i}`} className={cx("icon-start")}>
                            <FontAwesomeIcon
                              icon={starNull}
                              className={cx("icon")}
                            ></FontAwesomeIcon>
                          </span>
                        );
                      }

                      return stars;
                    })()}
                  </span>
                  <span className={cx("rate-number")}>
                    ({item.vote_average})
                  </span>
                </p>

                <p className={cx("vote-count")}>
                  <span>Lượng người đánh giá: </span>
                  <span>{item.vote_count}</span>
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListMovieSideBar;

ListMovieSideBar.prototype = {
  title: PropType.string,
  data: PropType.array,
};
