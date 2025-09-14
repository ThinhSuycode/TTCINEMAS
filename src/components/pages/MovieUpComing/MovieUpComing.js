import classNames from "classnames/bind";
import styles from "./MovieUpComing.module.scss";
import ListMovieContent from "../../ListMovieContent/ListMovieContent";
import { useEffect, useState } from "react";
import ListMovie from "../../ListMovie/ListMovie";
import { SearchProvider } from "../../../context/SearchProvider";
import { useLocation } from "react-router-dom";

const cx = classNames.bind(styles);

function MovieUpComing() {
  const [movieUpComing, setMovieUpComing] = useState([]);
  const [movieTopRate, setMovieTopRate] = useState([]);
  const [page, setPage] = useState(null);
  const [pageChanges, setPageChanges] = useState(1);
  const { pathname } = useLocation();

  //Quay về trang đầu khi load trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, pageChanges]);

  const searchResult = SearchProvider();
  useEffect(() => {
    const fetchMovieRate = async () => {
      const url2 =
        "https://api.themoviedb.org/3/movie/top_rated?language=vi&page=3";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
        },
      };
      const res2 = await fetch(url2, options);
      const data2 = await res2.json();
      setMovieTopRate(data2.results);
    };
    fetchMovieRate();
    const fetchPage = (e) => {
      const target = e.detail;
      setPageChanges(target);
    };
    window.addEventListener("pageChange", fetchPage);
    return () => {
      window.removeEventListener("pageChange", fetchPage);
    };
  }, []);

  useEffect(() => {
    const fetchMovieUpComing = async (page) => {
      const url = `https://api.themoviedb.org/3/movie/upcoming?language=vi-VN&page=${page}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
        },
      };
      const res = await fetch(url, options);
      const data = await res.json();
      setMovieUpComing(data.results.slice(0, 18));
      setPage(data.total_pages);
    };
    if (pageChanges) fetchMovieUpComing(pageChanges);
  }, [pageChanges]);
  return (
    <div className={cx("MovieUpComing-Wrapper")}>
      <div className={cx("MovieUpComing-inner")}>
        {searchResult.length > 0 ? (
          <ListMovieContent
            title={"KẾT QUẢ ĐƯỢC TÌM KIẾM MỚI NHẤT"}
            data={searchResult}
            large={true}
          ></ListMovieContent>
        ) : (
          <div className={cx("MovieUpComing-result")}>
            <ListMovieContent
              title={"PHIM SẮP RA MẮT"}
              data={movieUpComing}
              page={page}
              showPaginationPage={true}
              large={true}
            ></ListMovieContent>
          </div>
        )}
        <div className={cx("MovieUpComing-relative")}>
          <ListMovie title={"PHIM THỊNH HÀNH"} data={movieTopRate}></ListMovie>
        </div>
      </div>
    </div>
  );
}

export default MovieUpComing;
