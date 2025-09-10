import classNames from "classnames/bind";
import styles from "./MovieVideo.module.scss";
import "react-multi-carousel/lib/styles.css";
import PropType from "prop-types";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import Modal from "react-modal";

const cx = classNames.bind(styles);

const customStyles = {
  overlay: {
    zIndex: 9999,
    position: "fixed",
    backgroundColor: "rgb(40 40 40 / 75%)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    background: "initial",
  },
};

const opts = {
  height: "600",
  width: "1000",
  display: "flex",
  justifyContent: "center",
  alignItem: "center",
  playerVars: {
    autoplay: 1,
  },
};

function MovieVideo({ data, checkVideo, onClose }) {
  const [videoKey, setVideoKey] = useState("");

  useEffect(() => {
    const HandleMovieItem = async (id) => {
      setVideoKey("");
      try {
        const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmFjZDNiOWY0NTJlMjE1ZGY5NzRhMjkyYzQxMmY5MSIsIm5iZiI6MTc1NDczMTQ4OS42Mywic3ViIjoiNjg5NzEzZTFkMDg3NThjYTBlMjY3NzIzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.cEm5zG-WP9ikzUMhq08tUt0XuafbfJOZUozbCYnQxas`,
          },
        };
        const res = await fetch(url, options);
        const dataMovie = await res.json();
        if (dataMovie.results?.length > 0) {
          setVideoKey(dataMovie.results[0].key);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (data && checkVideo) HandleMovieItem(data);
  }, [data, checkVideo]);

  return (
    <div className={cx("movie-inner")}>
      <Modal
        isOpen={checkVideo}
        onRequestClose={onClose}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        style={customStyles}
      >
        {videoKey && <YouTube videoId={videoKey} opts={opts} />}
      </Modal>
    </div>
  );
}

export default MovieVideo;
MovieVideo.prototype = {
  data: PropType.node,
};
