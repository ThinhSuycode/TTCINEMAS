import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import appStore from "../../assets/images/appstore.png";
import googlePlay from "../../assets/images/googleplay.png";

const cx = classNames.bind(styles);

function Footer() {
  return (
    <div className={cx("footer")}>
      <div className={cx("footer-inner-top")}>
        <div className={cx("footer-inner-left")}>
          <div className={cx("footer-inner-left__info")}>
            <h4 className={cx("footer-inner__title")}>CÔNG TY HÃNG PHIM VN</h4>
            <p className={cx("footer-inner__desc")}>
              Địa chỉ: Phước Thuận - Tuy Phước - Bình Định
            </p>
            <p className={cx("footer-inner__phoneAct")}>HOTLINE: 0869114177</p>
          </div>

          <div className={cx("footer-inner-left__social")}>
            <h4 className={cx("footer-inner__title")}>MẠNG XÃ HỘI:</h4>
            <div className={cx("footer-inner-social-list")}>
              <a
                href="https://www.facebook.com/thinhcutek5?locale=vi_VN"
                className={cx("footer-inner-social-item")}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="/" className={cx("footer-inner-social-item")}>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://www.youtube.com/@funnychillzone1"
                className={cx("footer-inner-social-item")}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
        </div>

        <div className={cx("footer-inner-right")}>
          <div className={cx("footer-inner-right-list")}>
            <div className={cx("footer-inner-right-item")}>
              <div className={cx("footer-inner-item-box")}>
                <h4 className={cx("footer-inner__title")}>SẢN PHẨM</h4>
                <div className={cx("footer-inner__desc")}>
                  <p>
                    <FontAwesomeIcon icon={faAngleRight} />
                    SẢN PHẨM NÀY THUỘC VỀ TTCINEMA
                  </p>
                </div>
              </div>

              <div className={cx("footer-inner-item-box")}>
                <h4 className={cx("footer-inner__title")}>DỊCH VỤ</h4>
                <p className={cx("footer-inner__desc")}>
                  Đăng ký gói vip để theo dõi
                </p>
                <p className={cx("footer-inner__desc")}>Hỗ trợ trả góp</p>
                <p className={cx("footer-inner__desc")}>
                  Vòng quay voucher đặc biệt
                </p>
              </div>
            </div>

            <div className={cx("footer-inner-right-item")}>
              <div className={cx("footer-inner-item-box")}>
                <h4 className={cx("footer-inner__title")}>CHÍNH SÁCH</h4>
                <p className={cx("footer-inner__desc")}>Chính sách xã hội</p>
                <p className={cx("footer-inner__desc")}>Chính sách ưu đãi</p>
                <p className={cx("footer-inner__desc")}>Chính sách cá nhân</p>
              </div>

              <div className={cx("footer-inner-item-box")}>
                <h4 className={cx("footer-inner__title")}>DOWNLOAD APP</h4>
                <ul className={cx("list-app")}>
                  <li>
                    <a href="/" className={cx("app-store")}>
                      <img src={appStore} alt="App Store" />
                    </a>
                  </li>
                  <li>
                    <a href="/" className={cx("google-play")}>
                      <img src={googlePlay} alt="Google Play" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className={cx("footer-inner-right-item")}>
              <div className={cx("footer-inner-item-box")}>
                <h4 className={cx("footer-inner__title")}>ƯU ĐÃI</h4>
                <p className={cx("footer-inner__desc")}>
                  Tặng quà tri ân khi đăng ký gói năm
                </p>
                <p className={cx("footer-inner__desc")}>Voucher giảm giá</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("footer-inner-bottom")}>
        <p>No Coppy @2025. Bản quyền của TTCINEMAS</p>
      </div>
    </div>
  );
}

export default Footer;
