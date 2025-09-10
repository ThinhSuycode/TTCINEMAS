import classNames from "classnames/bind";
import styles from "./ListGenres.module.scss";
import PropType from "prop-types";
import ListMovieContent from "../../ListMovieContent/ListMovieContent";
import { useEffect, useState } from "react";
const cx = classNames.bind(styles);

function ListGenres() {
  const dataGet = JSON.parse(localStorage.getItem("selectGenres")) || {};
  const [listMovieGenres, setListMovieGenres] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectPageGenre, setSelectPageGenre] = useState(1);
  useEffect(() => {
    const handlePageChange = (e) => {
      const newPage = e.detail;
      setSelectPageGenre(newPage);
      localStorage.setItem("selectPages", JSON.stringify(newPage));
    };

    window.addEventListener("pageChange", handlePageChange);

    return () => {
      window.removeEventListener("pageChange", handlePageChange);
    };
  }, []);

  useEffect(() => {
    const fetchMovieGenres = async (id, pageId) => {
      try {
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=API_KEY&with_genres=${id}&page=${pageId}`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
          },
        };
        const res = await fetch(url, options);
        const dataMovie = await res.json();
        setListMovieGenres(dataMovie.results);
        setPageNumber(dataMovie.total_pages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMovieGenres(dataGet.id, selectPageGenre);
  }, [dataGet.id, selectPageGenre]);

  return (
    <div className={cx("ListGenres-Wrapper")}>
      <div className={cx("ListGenres-inner")}>
        <ListMovieContent
          data={listMovieGenres}
          title={dataGet.name}
          page={pageNumber}
          showButton={false}
          showPaginationPage={true}
        ></ListMovieContent>
      </div>
    </div>
  );
}

export default ListGenres;
