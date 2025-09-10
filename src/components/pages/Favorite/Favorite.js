import classNames from "classnames/bind";
import styles from "./Favorite.module.scss";
import Button from "../../Button";
import { useEffect, useState } from "react";
import MovieUserContent from "../../MovieUserContent/MovieUserContent";

const cx = classNames.bind(styles);

function Favorite() {
  const userActiveRaw = localStorage.getItem("userActive");
  const userActive = userActiveRaw ? JSON.parse(userActiveRaw) : {};
  const listAccount = localStorage.getItem("listUserAccount")
    ? JSON.parse(localStorage.getItem("listUserAccount"))
    : [];

  const [favoriteList, setFavoriteList] = useState({
    listMovie: [],
    listActor: [],
  });
  console.log(favoriteList.listMovie);

  const [activeTab, setActiveTab] = useState("movie");
  useEffect(() => {
    setFavoriteList({
      listMovie: userActive.storedMovies || [],
      listActor: userActive.storedActors || [],
    });
  }, []);

  return (
    <div className={cx("Favorite-Wrapper")}>
      <div className={cx("Favorite-inner")}>
        <h3 className={cx("Favorite__heading")}>Yêu thích</h3>

        <div className={cx("Favorite-act")}>
          <Button
            onClick={() => setActiveTab("movie")}
            className={cx("act-movie", { active: activeTab === "movie" })}
          >
            Phim
          </Button>
          <Button
            onClick={() => setActiveTab("actor")}
            className={cx("act-actor", { active: activeTab === "actor" })}
          >
            Diễn viên
          </Button>
        </div>

        <div className={cx("Favorite-content")}>
          <div className={cx("Favorite-list")}>
            {activeTab === "movie" ? (
              favoriteList.listMovie.length > 0 ? (
                <MovieUserContent data={favoriteList.listMovie} favorite />
              ) : (
                <div className={cx("empty")}>
                  Bạn chưa có bộ phim yêu thích nào
                </div>
              )
            ) : favoriteList.listActor.length > 0 ? (
              <div className={cx("actor-item")}>Danh sách diễn viên</div>
            ) : (
              <div className={cx("empty")}>
                Bạn chưa có nhân vật yêu thích nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Favorite;
