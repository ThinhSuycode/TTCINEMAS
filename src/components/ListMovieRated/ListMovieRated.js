import classNames from "classnames/bind";
import styles from "./ListMovieRated.module.scss";
import { useEffect } from "react";

const cx = classNames.bind(styles);

function ListMovieRated() {
  useEffect();
  return (
    <div className={cx("ListMovieRated-Wrapper")}>
      <div className={cx("ListMovieRated-inner")}></div>
    </div>
  );
}

export default ListMovieRated;
