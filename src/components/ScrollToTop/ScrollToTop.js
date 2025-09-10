import classNames from "classnames/bind";
import styles from "./ScrollToTop.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

const cx = classNames.bind(styles);

function ScrollToTop() {
  const [showScroll, setShowScroll] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // mỗi khi pathname thay đổi thì scroll top

  const onHandleScrollTop = () => {
    // window.scrollTo({ top: 0, smooth: "easeInOutQuart", duration: 600 });
    scroll.scrollToTop({ smooth: "easeInOutQuart", duration: 600 });
  };

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 200) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  return (
    <>
      <div
        className={cx("ScrollToTop-Wrapper", { showScrollTop: showScroll })}
        onClick={() => onHandleScrollTop()}
      >
        <div className={cx("ScrollToTop-box")}>
          <FontAwesomeIcon icon={faAnglesUp}></FontAwesomeIcon>
        </div>
      </div>
    </>
  );
}

export default ScrollToTop;
