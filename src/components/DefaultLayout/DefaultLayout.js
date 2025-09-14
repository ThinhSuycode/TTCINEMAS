import style from "./DefaultLayout.module.scss";
import classNames from "classnames/bind";
import { Header, Footer } from "../../layout";
import { useState, useEffect } from "react";
import ListMovieSideBar from "../ListMovieSideBar/ListMovieSideBar";
import BannerDesign from "../BannerDesign/BannerDesign";

const cx = classNames.bind(style);

function DefaultLayout({ children, only }) {
  const [ListMovieTrending, setListMovieTrending] = useState([]);
  const [ListMovieComing, setListMovieComing] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      const url3 =
        "https://api.themoviedb.org/3/trending/movie/day?language=vi";
      const url4 =
        "https://api.themoviedb.org/3/movie/upcoming?language=vi&page=1";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
        },
      };
      const [res3, res4] = await Promise.all([
        fetch(url3, options),
        fetch(url4, options),
      ]);

      const data3 = await res3.json();
      const data4 = await res4.json();

      setListMovieTrending(data3.results.slice(0, 11));
      setListMovieComing(data4.results.slice(0, 15));
    };
    fetchMovie();
  }, []);
  console.log(process.env.REACT_APP_KEYS);
  return (
    <div className={cx("Wrapper")}>
      <Header></Header>
      <div className={cx("container")}>
        {!only && <BannerDesign></BannerDesign>}
        <div className={cx("content")}>
          <div className={cx("content-left", { activeOnly: only })}>
            <ListMovieSideBar
              title={"TRENDING"}
              data={ListMovieTrending}
            ></ListMovieSideBar>
            {!only && (
              <ListMovieSideBar
                title={"UP COMING"}
                data={ListMovieComing}
              ></ListMovieSideBar>
            )}
          </div>
          <div className={cx("content-right", { activeOnly: only })}>
            {children}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default DefaultLayout;
