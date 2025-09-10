import { createContext } from "react";
import "react-multi-carousel/lib/styles.css";
import YouTube from "react-youtube";
import Modal from "react-modal";
import { useState } from "react";
import PropType from "prop-types";

const MovieListContext = createContext();

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
  height: "500",
  width: "640",
  display: "flex",
  justifyContent: "center",
  alignItem: "center",
  playerVars: {
    autoplay: 1,
  },
};
const MovieListProvider = ({ children }) => {
  const [videoKey, setVideoKey] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
      setVideoKey(dataMovie.results[0].key);
      setModalIsOpen(true);
    } catch (error) {
      setModalIsOpen(false);
      console.log(error);
    }
  };

  return (
    <MovieListContext.Provider value={{ HandleMovieItem }}>
      {children}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <YouTube videoId={videoKey} opts={opts} />
      </Modal>
    </MovieListContext.Provider>
  );
};

export { MovieListContext, MovieListProvider };
MovieListProvider.prototype = {
  children: PropType.node,
};
