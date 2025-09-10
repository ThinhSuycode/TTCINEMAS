import classNames from "classnames/bind";
import styles from "./MovieAll.module.scss";
import ListMovieContent from "../../ListMovieContent/ListMovieContent";
import { useEffect, useState, useMemo } from "react";
import ListMovie from "../../ListMovie/ListMovie";
import { SearchProvider } from "../../../context/SearchProvider";

const cx = classNames.bind(styles);

function MovieAll() {
  const getMovieAll = useMemo(() => {
    return JSON.parse(localStorage.getItem("viewGenresAll")) || {};
  }, []);
  const [MovieAll, setMovieAll] = useState([]);
  const [movieTopRate, setMovieTopRate] = useState([]);

  useEffect(() => {
    setMovieAll(getMovieAll.data);
  }, [getMovieAll]);
  const [pageChanges, setPageChanges] = useState(1);

  const searchResult = SearchProvider();
  useEffect(() => {
    const fetchMovieRate = async () => {
      const url2 =
        "https://api.themoviedb.org/3/movie/top_rated?language=vi&page=1";
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
    const fetchMovieAll = async (page) => {
      const url = `https://api.themoviedb.org/3/movie/popular?language=vi-VN&page=${page}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
        },
      };
      const res = await fetch(url, options);
      const data = await res.json();
      setMovieAll(data.results.slice(0, 18));
    };
    if (pageChanges) fetchMovieAll(pageChanges);
  }, [pageChanges]);

  return (
    <div className={cx("MovieAll-Wrapper")}>
      <div className={cx("MovieAll-inner")}>
        {searchResult.length > 0 ? (
          <ListMovieContent
            title={"KẾT QUẢ ĐƯỢC TÌM KIẾM MỚI NHẤT"}
            data={searchResult}
            large={true}
          ></ListMovieContent>
        ) : (
          <div className={cx("MovieAll-result")}>
            <ListMovieContent
              title={getMovieAll.title}
              data={MovieAll}
              // page={page}
              showPaginationPage={true}
              large={true}
            ></ListMovieContent>
          </div>
        )}
        <div className={cx("MovieAll-relative")}>
          <ListMovie data={movieTopRate} title={"Nổi bật"}></ListMovie>
        </div>
      </div>
    </div>
  );
}

export default MovieAll;
