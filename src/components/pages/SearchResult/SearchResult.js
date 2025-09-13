import classNames from "classnames/bind";
import styles from "./SearchResult.module.scss";
import ListMovieContent from "../../ListMovieContent/ListMovieContent";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function SearchResult() {
  const [search, setSearch] = useState(
    JSON.parse(localStorage.getItem("searchInput")) || ""
  );
  const [page, setPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    const fetchSearch = () => {
      const input = JSON.parse(localStorage.getItem("searchInput")) || "";
      setSearch(input);
    };
    window.addEventListener("changeSearch", fetchSearch);
    return () => {
      window.removeEventListener("changeSearch", fetchSearch);
    };
  }, []);
  console.log(searchResult);
  useEffect(() => {
    const fetchPageCurrent = (e) => {
      const target = e.detail;
      setPage(target);
    };
    window.addEventListener("pageChange", fetchPageCurrent);
    return () => {
      window.removeEventListener("pageChange", fetchPageCurrent);
    };
  }, []);
  useEffect(() => {
    const fetchMovieSearch = async (input, page) => {
      try {
        const url = `https://api.themoviedb.org/3/search/movie?query=${input}&include_adult=false&language=vi&page=${page}`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
          },
        };
        const res = await fetch(url, options);
        const data = await res.json();
        setSearchResult(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMovieSearch(search, page);
  }, [search, page]);
  return (
    <div className={cx("SearchResult")}>
      <div className={cx("SearchResult-inner")}>
        <ListMovieContent
          large
          data={searchResult && searchResult.results}
          title={"Kết quả tìm kiếm: "}
          search={search}
          page={searchResult && searchResult.total_pages}
          showPaginationPage
        ></ListMovieContent>
      </div>
    </div>
  );
}

export default SearchResult;
