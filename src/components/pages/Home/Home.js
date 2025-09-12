import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";
import { ListMovie, ListMovieContent } from "../..";
import { MovieListProvider } from "../../../context";
import BannerHome from "../../BannerHome/BannerHome";
import "react-multi-carousel/lib/styles.css";
import { SearchProvider } from "../../../context/SearchProvider";
import { Alert } from "../..";

const cx = classNames.bind(style);

function Home() {
  const [listMovie, setListMovie] = useState([]);
  const [rateMovie, setRateMovie] = useState([]);
  const [movieNowPlaying, setMovieNowPlaying] = useState([]);
  const [favoriteMovie, setFavoriteMovie] = useState([]);
  const [totalMovie, setTotalMovie] = useState([]);
  const [movieCinema, setMovieCinema] = useState([]);

  const resultSearch = SearchProvider();
  useEffect(() => {
    const fetchMovie = async () => {
      const url1 =
        "https://api.themoviedb.org/3/movie/popular?language=vi&page=3";
      const url2 =
        "https://api.themoviedb.org/3/movie/top_rated?language=vi&page=1";
      const url3 =
        "https://api.themoviedb.org/3/movie/now_playing?language=vi&page=1";
      const url4 =
        "https://api.themoviedb.org/3/movie/popular?language=vi&page=2";
      const url5 =
        "https://api.themoviedb.org/3/movie/popular?language=vi-VN&page=2";
      const url6 =
        "https://api.themoviedb.org/3/movie/popular?language=vi-VN&page=8";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
        },
      };

      const [res1, res2, res3, res4, res5, res6] = await Promise.all([
        fetch(url1, options),
        fetch(url2, options),
        fetch(url3, options),
        fetch(url4, options),
        fetch(url5, options),
        fetch(url6, options),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();
      const data3 = await res3.json();
      const data4 = await res4.json();

      const data5 = await res5.json();
      const data6 = await res6.json();
      setListMovie(data1.results);
      setRateMovie(data2.results);
      setMovieNowPlaying(data3.results);
      setFavoriteMovie(data4.results);
      setTotalMovie(data5.results);
      setMovieCinema(data6.results);
    };
    fetchMovie();
  }, []);

  return (
    <MovieListProvider>
      <div className={cx("Home-Wrapper")}>
        <div className={cx("Home-inner")}>
          {Array.isArray(resultSearch) && resultSearch.length > 0 > 0 ? (
            <ListMovie title="Kết quả tìm kiếm" data={resultSearch} />
          ) : (
            <div className={cx("Home-content")}>
              <BannerHome></BannerHome>
              <div className={cx("Home-content-top")}>
                <ListMovie title="DANH SÁCH PHIM" data={listMovie} />
                <ListMovie title="PHIM LIÊN QUAN" data={rateMovie} />
                <ListMovie title="PHIM MỚI NHẤT" data={movieNowPlaying} />
                <ListMovie title="PHIM ĐƯỢC YÊU THÍCH" data={favoriteMovie} />
              </div>
              <div className={cx("Home-content-bottom")}>
                <ListMovieContent
                  title={"Tổng hợp phim"}
                  data={totalMovie}
                  page={20}
                  showPaginationPage={false}
                  showButton={true}
                ></ListMovieContent>
                <ListMovieContent
                  title={"Phim chiếu rạp"}
                  data={movieCinema}
                  showButton={true}
                  showPaginationPage={false}
                ></ListMovieContent>
              </div>
            </div>
          )}
        </div>
      </div>
    </MovieListProvider>
  );
}

export default Home;
