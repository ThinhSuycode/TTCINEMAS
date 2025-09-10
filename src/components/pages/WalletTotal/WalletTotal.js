import classNames from "classnames/bind";
import styles from "./WalletTotal.module.scss";
import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bank1 from "../../../assets/icon/bank.webp";
import bank3 from "../../../assets/icon/momo.webp";
import bank2 from "../../../assets/icon/phone.webp";
import viettel from "../../../assets/icon/viettel.png";
import mobi from "../../../assets/icon/mobiphone.png";
import vina from "../../../assets/icon/vinaphone.png";

import {
  faArrowRight,
  faCheckCircle,
  faCoins,
  faMars,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
const dataBank = [
  { title: "Gói 100K", price: "100.000", qr: 100000 },
  { title: "Gói 200K", price: "200.000", qr: 200000 },
  { title: "Gói 500K", price: "500.000", qr: 500000 },
  { title: "Gói 1M", price: "1.000.000", qr: 1000000 },
];
const cardPhone = [
  { img: viettel, desc: "Viettel" },
  { img: mobi, desc: "Mobiphone" },
  { img: vina, desc: "Vinaphone" },
];

function WalletTotal() {
  const [userActive, setUserActive] = useState(
    () => JSON.parse(localStorage.getItem("userActive")) || {}
  );
  const [selectIdx, setSelectIdx] = useState(null);
  const [activeDescBank, setActiveDescBank] = useState({});
  const [checkActive, setCheckActive] = useState(false);
  const [statusBank, setStatusBank] = useState("");
  const [selectIdxCard, setSelectIdxCard] = useState(0);
  const [contentQR, setContentQR] = useState(() =>
    Math.floor(Math.random() * 100)
  );
  const [countdown, setCountdown] = useState(60);

  const onHandleForm = useCallback(() => {
    alert(
      "Cảm ơn bạn đã thực hiện thanh toán hệ thông sẽ kiểm tra sớm nhất có thể cho bạn !!"
    );
    window.location.href = "/";
  }, []);

  // Đếm ngược và đổi mã QR sau 60s
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          setContentQR(Math.floor(Math.random() * 100));
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cập nhật userActive khi localStorage thay đổi
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userActive")) || {};
    setUserActive(user);
  }, []);

  // Chọn gói bank
  const onHandleBank = useCallback(
    (idx) => {
      if (!checkActive) {
        setSelectIdx(idx);
        setActiveDescBank(dataBank[idx]);
      }
    },
    [checkActive]
  );

  // Kiểm tra đã chọn đủ thông tin để active thanh toán
  useEffect(() => {
    setCheckActive(
      Object.keys(activeDescBank).length > 0 && statusBank.trim() !== ""
    );
  }, [activeDescBank, statusBank]);

  // Hiển thị phương thức thanh toán
  const showPayment = useCallback(
    (statusBank) => {
      if (statusBank === "cardPhone") {
        return (
          <div className={cx("payment-phoneCard")}>
            <div className={cx("title")}>Chọn nhà mạng</div>
            <div className={cx("list-method")}>
              {cardPhone.map((item, idx) => (
                <div
                  key={idx}
                  className={cx("item", { activeItem: idx === selectIdxCard })}
                  onClick={() => setSelectIdxCard(idx)}
                >
                  <div className={cx("item-top")}>
                    <img src={item.img} alt="" />
                  </div>
                  <div className={cx("item-bottom")}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div className={cx("form-input")}>
              <div className={cx("input-item")}>
                <input type="text" placeholder="Mã thẻ" />
              </div>
              <div className={cx("input-item")}>
                <input type="text" placeholder="Seri thẻ" />
              </div>
            </div>
            <button className={cx("active-form")}>Gửi</button>
          </div>
        );
      }
      if (statusBank === "bank") {
        return (
          <div className={cx("payment-bank")}>
            <div className={cx("bank-left")}>
              <div className={cx("desc-bank")}>
                Quý khách vui lòng chuyển khoản đến tài khoản sau:
              </div>
              <div className={cx("img-bank")}>
                <img
                  src={`https://img.vietqr.io/image/BIDV-5811662666-compact2.png?amount=${
                    activeDescBank.qr || 0
                  }&addInfo=ttAnime${contentQR}&accountName=Tran%20Quy%20Thinh}`}
                  alt=""
                />
              </div>
            </div>
            <div className={cx("bank-right")}>
              <div className={cx("info-bank")}>
                <div>
                  <span className={cx("title")}>Chủ tài khoản:</span>{" "}
                  <span className={cx("desc-info")}>TRẦN QUÝ THỊNH</span>
                </div>
                <div>
                  <span className={cx("title")}>Số tài khoản: </span>
                  <span className={cx("desc-info")}>5811662666</span>
                </div>
                <div>
                  <span className={cx("title")}>Ngân hàng:</span>{" "}
                  <span className={cx("desc-info")}>
                    BIDV, Chi nhánh Bình Định
                  </span>
                </div>
                <div>
                  <span className={cx("title")}>Nội dung chuyển khoản: </span>
                  <span className={cx("desc-info")}>ttAnime{contentQR}</span>
                </div>
              </div>
              <div className={cx("desc-bank")}>
                Sau khi chuyển khoản vui lòng bấm nút "Hoàn thành" bên dưới để
                hệ thống xác nhận.
              </div>
              <button className={cx("active-form")} onClick={onHandleForm}>
                Hoàn thành
              </button>
            </div>
          </div>
        );
      }
      return null;
    },
    [statusBank, selectIdxCard, contentQR, activeDescBank, onHandleForm]
  );

  return (
    <div className={cx("WalletTotal-Wrapper")}>
      <div className={cx("WalletTotal-inner")}>
        <div className={cx("WalletTotal-heading")}>
          Nạp Coin-TT vào tài khoản
        </div>
        <div className={cx("WalletTotal-main")}>
          <div className={cx("main-info")}>
            <div className={cx("info-avatar")}>
              <img src={userActive.avatar} alt="" />
            </div>
            <div className={cx("info-user")}>
              <div className={cx("user-name")}>
                <span>{userActive.username}</span>
                <span>
                  <FontAwesomeIcon icon={faMars}></FontAwesomeIcon>
                </span>
              </div>
              <div className={cx("total-amount")}>
                <span>
                  <FontAwesomeIcon icon={faWallet}></FontAwesomeIcon>
                </span>
                <span>Số dư</span>
                <span className={cx("price")}>
                  <span> 0</span>
                  <span>
                    <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>
                  </span>
                </span>
              </div>
              <div className={cx("history-payment")}>
                <span>Xem lịch sử nạp </span>
                <span>
                  <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
                </span>
              </div>
            </div>
          </div>
          <div className={cx("main-payment")}>
            <div className={cx("payment-heading")}>
              <span>Bước 1: </span>Chọn gói thích hợp muốn mua
            </div>
            <div className={cx("list-step")}>
              {dataBank.length > 0 ? (
                dataBank.map((item, idx) => (
                  <div
                    key={idx}
                    className={cx("step-item", {
                      selectActive: idx === selectIdx,
                    })}
                    onClick={() => onHandleBank(idx)}
                  >
                    <p className={cx("title")}>{item.title}</p>
                    <p>{item.price} VNĐ</p>
                    <div
                      className={cx("check-price", {
                        activeColor: idx === selectIdx,
                      })}
                    >
                      <FontAwesomeIcon icon={faCheckCircle}></FontAwesomeIcon>
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có dữ liệu!!</div>
              )}
            </div>
            {Object.keys(activeDescBank).length > 0 && (
              <div className={cx("desc")}>
                Bạn đã thực hiện chọn {activeDescBank.title}{" "}
                <span>
                  <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>
                </span>{" "}
                với mệnh giá {activeDescBank.price} VNĐ
              </div>
            )}

            <div className={cx("payment-heading")}>
              <span>Bước 2: </span>Chọn phương thức thanh toán
            </div>
            <div className={cx("list-payment")}>
              <div
                className={cx("payment-item", {
                  active: statusBank === "bank",
                })}
              >
                <div className={cx("heading")}>
                  <div className={cx("payment-img")}>
                    <img src={bank1} alt="" />
                  </div>
                  <span>Chuyển khoản ngân hàng</span>
                </div>
                <button onClick={() => setStatusBank("bank")}>Chọn</button>
              </div>
              <div className={cx("payment-item")}>
                <div className={cx("heading")}>
                  <div className={cx("payment-img")}>
                    <img src={bank3} alt="" />
                  </div>
                  <span>Thanh toán qua ví momo</span>
                </div>
                <button>Chọn</button>
              </div>
              <div
                className={cx("payment-item", {
                  active: statusBank === "cardPhone",
                })}
              >
                <div className={cx("heading")}>
                  <div className={cx("payment-img")}>
                    <img src={bank2} alt="" />
                  </div>
                  <span>Chuyển qua thẻ tín dụng</span>
                </div>
                <button onClick={() => setStatusBank("cardPhone")}>Chọn</button>
              </div>
            </div>
            {statusBank && Object.keys(activeDescBank).length > 0 && (
              <div className={cx("form-payment", { show: statusBank })}>
                <div className={cx("payment-inner")}>
                  {statusBank === "cardPhone" && (
                    <div className={cx("heading")}>
                      <div className={cx("heading-left")}>
                        <span className={cx("logo-small")}>
                          <img src={bank2} alt="" />
                        </span>
                        <span>Thanh toán bằng thẻ điện thoại</span>
                      </div>
                    </div>
                  )}
                  {statusBank === "bank" && (
                    <div className={cx("heading")}>
                      <div className={cx("heading-left")}>
                        <span className={cx("logo-small")}>
                          <img src={bank1} alt="" />
                        </span>
                        <span>Chuyển khoản ngân hàng</span>
                      </div>
                      <div className={cx("qr-timer")}>
                        <span>Mã QR sẽ đổi sau: {countdown}s</span>
                      </div>
                    </div>
                  )}
                  {showPayment(statusBank)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletTotal;
