import classNames from "classnames/bind";
import styles from "./BannerHome.module.scss";
import imgBanner from "../../assets/images/bannerHome_large.jpg";

const cx = classNames.bind(styles);
function BannerHome() {
  return (
    <div className={cx("BannerHome-Wrapper")}>
      <div className={cx("BannerHome-inner")}>
        <div className={cx("BannerHome-img")}>
          <img src={imgBanner} alt="" />
          <div className={cx("blur-img")}></div>
        </div>
        <div className={cx("BannerHome-info")}>
          <h2 className={cx("BannerHome-title")}>
            WEBSITE XEM PHIM CHẤT LƯỢNG CAO KHÔNG ĐƯỢC BỎ LỠ CÁC PHIM MỚI TẠI
            TTCINEMAS
          </h2>
          <p className={cx("BannerHome-desc")}>
            Chúc mọi người xem phim vui vẻ hãy nhấn yêu thích để ủng hộ kênh của
            chúng tôi
          </p>
        </div>
      </div>
      <div className={cx("icon-down")}></div>
    </div>
  );
}

export default BannerHome;
