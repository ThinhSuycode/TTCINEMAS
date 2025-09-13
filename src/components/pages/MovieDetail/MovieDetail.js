import classNames from "classnames/bind";
import styles from "./MovieDetail.module.scss";
import { useEffect, useState, useCallback, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlay,
  faPlus,
  faShare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import ListMovie from "../../ListMovie/ListMovie";
import { MovieListProvider } from "../../../context";
import MovieVideo from "../../MovieVideo/MovieVideo";
import { Alert } from "../..";

const cx = classNames.bind(styles);

function MovieDetail() {
  const selectMovie = JSON.parse(localStorage.getItem("selectedMovie")) || {};
  const [activeAddPlayList, setActiveAddPlayList] = useState(false);
  const refInput = (node) => node && node.focus();
  const [inputPlayListAdd, setInputPlayListAdd] = useState("");
  const [visibleCount, setVisibleCount] = useState(7);
  const [selectedDetail, setSelectedDetail] = useState({});
  const [movieGenresName, setMovieGenresName] = useState([]);
  const [characterMovie, setCharacterMovie] = useState([]);
  const [listMovie, setListMovie] = useState([]);
  const [reviewMovieCheck, setReviewMovieCheck] = useState(false);
  const [checkHeart, setCheckHeart] = useState(false);
  const [stored, setStored] = useState(
    () => JSON.parse(localStorage.getItem("userActive")) || {}
  );
  const [listAccount, setListAccount] = useState(
    () => JSON.parse(localStorage.getItem("listUserAccount")) || []
  );
  const [selectPlayListIdx, setSelectPlayListIdx] = useState(null);
  const [activePlayList, setActivePlayList] = useState(false);
  const exists = (stored.storedMovies || []).some(
    (m) => m.id === selectedDetail.id
  );
  const [alerts, setAlerts] = useState([]);
  const bookMarkRef = useRef(null);
  const playListModalRef = useRef(null);

  //Thực hiện push alerts

  const pushAlert = (msg) => {
    const id = Math.floor(Math.random() * 10000);
    setAlerts((prev) => [...prev, { id, message: msg }]);
  };

  const onChangeInput = useCallback((e) => {
    setInputPlayListAdd(e);
  }, []);
  const onHandleAddNew = useCallback(() => {
    setActiveAddPlayList(true);
  }, []);
  const onHandleAdd = useCallback(() => {
    if (!inputPlayListAdd.trim()) {
      pushAlert("Vui lòng nhập tên danh sách!");
      return;
    }
    if ((stored.storedPlayList || []).length >= 5) {
      pushAlert("Bạn chỉ được tạo tối đa 5 danh sách!");
      return;
    }
    if (
      stored.storedPlayList?.some((pl) => pl.name === inputPlayListAdd.trim())
    ) {
      pushAlert("Tên danh sách đã tồn tại. Vui lòng chọn tên khác!");
      return;
    }
    const newPlayList = {
      name: inputPlayListAdd.trim(),
      movies: [],
    };
    const newStored = {
      ...stored,
      storedPlayList: [...(stored.storedPlayList || []), newPlayList],
    };
    setStored(newStored);
    localStorage.setItem("userActive", JSON.stringify(newStored));
    const newListAccount = listAccount.map((acc) =>
      acc.email === stored.email ? newStored : acc
    );
    setListAccount(newListAccount);
    localStorage.setItem("listUserAccount", JSON.stringify(newListAccount));
    setInputPlayListAdd("");
    setActiveAddPlayList(false);
    pushAlert("Đã thêm danh sách mới!");
  }, [inputPlayListAdd, stored, listAccount]);
  const onHandleClose = useCallback(() => {
    setActiveAddPlayList(false);
    setInputPlayListAdd("");
  }, []);

  useEffect(() => {
    const updatedStored = JSON.parse(localStorage.getItem("userActive")) || {};
    setStored(updatedStored);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bookMarkRef.current &&
        !bookMarkRef.current.contains(e.target) &&
        playListModalRef.current &&
        !playListModalRef.current.contains(e.target)
      ) {
        setActivePlayList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //Xử lý hàm thêm danh sách
  const onHandlePlayList = useCallback(() => {
    if (!stored.email) {
      pushAlert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }
    setActivePlayList(true);
  }, [stored.email]);

  useEffect(() => {
    if (selectPlayListIdx !== null && selectMovie.id) {
      const playlist = stored.storedPlayList[selectPlayListIdx];
      const movieExists = playlist.movies.some((m) => m.id === selectMovie.id);
      if (!movieExists) {
        const updatedPlayList = stored.storedPlayList.map((pl, idx) =>
          idx === selectPlayListIdx
            ? { ...pl, movies: [...pl.movies, selectMovie] }
            : pl
        );
        const newStored = { ...stored, storedPlayList: updatedPlayList };
        setStored(newStored);
        localStorage.setItem("userActive", JSON.stringify(newStored));
        const newListAccount = listAccount.map((acc) =>
          acc.email === stored.email ? newStored : acc
        );
        setListAccount(newListAccount);
        localStorage.setItem("listUserAccount", JSON.stringify(newListAccount));
        pushAlert(`Đã thêm vào danh sách ${playlist.name}`);
        setSelectPlayListIdx(null);
        setActivePlayList(false);
      } else {
        pushAlert("Phim này đã có trong danh sách của bạn.");
        setSelectPlayListIdx(null);
        setActivePlayList(false);
      }
    }
    // eslint-disable-next-line
  }, [selectPlayListIdx]);
  // Fetch chi tiết phim
  useEffect(() => {
    const fetchMovieDetail = async (movieId) => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
        },
      };
      try {
        const [res1, res2] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?language=vi-VN`,
            options
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            options
          ),
        ]);

        const dataMovieDetail = await res1.json();
        const dataMovieCredits = await res2.json();

        setSelectedDetail(dataMovieDetail);
        setMovieGenresName(dataMovieDetail.genres || []);
        setCharacterMovie(dataMovieCredits.cast || []);
      } catch (err) {
        console.error("Lỗi khi fetch chi tiết phim:", err);
      }
    };

    if (selectMovie.id) fetchMovieDetail(selectMovie.id);
    else {
      pushAlert("Lỗi dữ liệu. Vui lòng thử lại!!");
      setTimeout(() => {
        window.location.href = "/";
      }, 4000);
      return;
    }
  }, [selectMovie.id]);

  // Xử lý thêm vào danh sách yêu thích
  const onHandleHeart = useCallback(() => {
    if (!stored.email) {
      pushAlert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }
    if (!exists) {
      const updateFavoriteNew = {
        ...stored,
        storedMovies: [...(stored.storedMovies || []), selectedDetail],
      };
      localStorage.setItem("userActive", JSON.stringify(updateFavoriteNew));
      localStorage.setItem(
        "listUserAccount",
        JSON.stringify(
          listAccount.map((acc) =>
            acc.email === stored.email ? updateFavoriteNew : acc
          )
        )
      );
      setCheckHeart(true);
      pushAlert("Đã thêm vào phim yêu thích!");
    } else {
      pushAlert("Phim này đã có trong danh sách yêu thích.");
    }
  }, [stored, selectedDetail, exists, listAccount]);

  useEffect(() => {
    const changeMovieIdBanner = (e) => {
      const target = e.detail;
      localStorage.setItem("selectedMovie", JSON.stringify(target));
      setSelectedDetail(target);
    };
    window.addEventListener("changeIdMovie", changeMovieIdBanner);
    return () => {
      window.removeEventListener("changeIdMovie", changeMovieIdBanner);
    };
  }, []);

  // Fetch danh sách phim liên quan
  useEffect(() => {
    const fetchMovieList = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_KEYS}`,
        },
      };
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/movie/popular?language=vi&page=3",
          options
        );
        const data = await res.json();
        setListMovie(data.results || []);
      } catch (err) {
        console.error("Lỗi khi fetch list movie:", err);
      }
    };

    fetchMovieList();
  }, []);

  return (
    <MovieListProvider>
      <Alert alertList={alerts} setAlertList={setAlerts}></Alert>
      <div className={cx("MovieDetail-Wrapper")}>
        <div className={cx("MovieDetail-inner")}>
          {activeAddPlayList && (
            <div className={cx("include-box")}>
              <div className={cx("modal-content")}>
                <p className={cx("heading")}>Thêm danh sách mới</p>
                <input
                  type="text"
                  placeholder="Tên danh sách"
                  ref={refInput}
                  onChange={(e) => onChangeInput(e.target.value)}
                  value={inputPlayListAdd}
                />
                <div className={cx("footer-modal")}>
                  <button className={cx("addPlayList")} onClick={onHandleAdd}>
                    <span>
                      <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                    </span>
                    <span>Thêm</span>
                  </button>
                  <button
                    className={cx("closePlayList")}
                    onClick={onHandleClose}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className={cx("MovieDetail-banner")}>
            <div className={cx("rate-movie")}>
              <FontAwesomeIcon icon={faStar} className={cx("icon")} />
              <span className={cx("point-rate")}>
                {selectedDetail.vote_average}
              </span>
              <span className={cx("rate-desc")}>Đánh giá</span>
            </div>
            <img
              src={
                selectedDetail.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${selectedDetail.backdrop_path}`
                  : "/fallback-banner.jpg"
              }
              alt={selectedDetail.title || "banner"}
              className={cx("img__big")}
            />
            <div className={cx("include-banner")}></div>
            <div className={cx("MovieDetail-banner-info")}>
              <div className={cx("movieDetail-img")}>
                <img
                  src={
                    selectedDetail.poster_path
                      ? `https://image.tmdb.org/t/p/w300${selectedDetail.poster_path}`
                      : "/fallback-poster.jpg"
                  }
                  alt={selectedDetail.title || "poster"}
                  className={cx("img__small")}
                />
              </div>
              <div className={cx("movieDetail-desc")}>
                <p className={cx("title")}>
                  <span>{selectedDetail.title}</span>
                  <span>
                    (
                    {selectedDetail.release_date
                      ? new Date(selectedDetail.release_date).getFullYear()
                      : "?"}
                    )
                  </span>
                </p>
                <p className={cx("movie-genres")}>
                  <span>Thể loại phim: </span>
                  <span>
                    {movieGenresName.map((item) => item.name).join(", ")}
                  </span>
                </p>
                <p className={cx("production_countries")}>
                  <span>Quốc gia: </span>
                  <span>
                    {selectedDetail.production_countries?.[0]?.name ||
                      "Không rõ"}
                  </span>
                </p>
                <p className={cx("release_date")}>
                  <span>Ngày phát hành: </span>
                  <span>
                    {selectedDetail.release_date
                      ? new Date(
                          selectedDetail.release_date
                        ).toLocaleDateString()
                      : "Chưa có"}
                  </span>
                </p>
                <p className={cx("overview")}>
                  <span>Giới thiệu bộ phim: </span>
                  <span>
                    {selectedDetail.overview || "Chưa được công chiếu"}
                  </span>
                </p>
                <p className={cx("popularity")}>
                  <span>Lượt xem: </span>
                  <span> {selectedDetail.popularity || "null"}</span>
                </p>
                <div className={cx("list-act")}>
                  <button
                    className={cx("icon-heart", {
                      active: checkHeart || exists,
                    })}
                    onClick={onHandleHeart}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  <div
                    className={cx("icon-bookMark")}
                    onClick={onHandlePlayList}
                    ref={bookMarkRef}
                  >
                    <button
                      className={cx("bookMark", {
                        active: stored.storedPlayList?.some((pl) =>
                          pl.movies?.some((m) => m.id === selectedDetail.id)
                        ),
                      })}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    {activePlayList && (
                      <div
                        className={cx("PlayList-modal")}
                        ref={playListModalRef}
                      >
                        <div className={cx("PlayList-list")}>
                          <div className={cx("PlayList-top")}>
                            <p>Danh sách</p>
                            <p>{stored.storedPlayList?.length || 0}/5</p>
                          </div>
                          <div className={cx("PlayList-content")}>
                            {stored.storedPlayList?.map((item, idx) => (
                              <div
                                key={idx}
                                className={cx("item")}
                                onClick={() => setSelectPlayListIdx(idx)}
                              >
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={item.movies?.some(
                                      (m) => m.id === selectedDetail.id
                                    )}
                                    onClick={() => setActivePlayList(false)}
                                    readOnly
                                  />
                                  <span>{item.name}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className={cx("PlayList-footer")}>
                            <button onClick={onHandleAddNew}>Thêm mới</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button className={cx("icon-share")}>
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                  <div className={cx("play-video-review")}>
                    <button
                      className={cx("icon-play")}
                      onClick={() => setReviewMovieCheck(true)}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                    <span onClick={() => setReviewMovieCheck(true)}>
                      Xem review
                    </span>
                    {reviewMovieCheck && (
                      <MovieVideo
                        checkVideo={reviewMovieCheck}
                        data={selectedDetail.id}
                        onClose={() => setReviewMovieCheck(false)}
                        className={cx("video-play")}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("ListMovieDetail-Actor")}>
            <p className={cx("list-actor__heading")}>DIỄN VIÊN NỔI BẬT</p>
            <div className={cx("list-actor")}>
              {characterMovie?.slice(0, visibleCount).map(
                (item) =>
                  item.profile_path && (
                    <div key={item.cast_id} className={cx("list-actor-item")}>
                      <div className={cx("actor-avatar")}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.profile_path}`}
                          alt={item.name}
                        />
                      </div>
                      <p className={cx("fullname")}>{item.name}</p>
                      <p className={cx("character-name")}>{item.character}</p>
                    </div>
                  )
              )}
            </div>

            {visibleCount < characterMovie.length && (
              <div className={cx("view-more-wrapper")}>
                <button
                  className={cx("view-more-btn")}
                  onClick={() => setVisibleCount(visibleCount + 7)}
                >
                  Xem thêm
                </button>
              </div>
            )}
          </div>
          <div className={cx("MovieDetail-related")}>
            <ListMovie data={listMovie} title={"PHIM LIÊN QUAN"} />
          </div>
        </div>
      </div>
    </MovieListProvider>
  );
}

export default MovieDetail;
