import styles from "./BannerDesign.module.scss";
import classNames from "classnames/bind";
import banner1 from "../../assets/icon/banner1.webp";
import banner2 from "../../assets/icon/banner2.webp";
import banner3 from "../../assets/icon/banner3.webp";
import banner4 from "../../assets/icon/banner4.webp";
import banner5 from "../../assets/icon/banner5.webp";
import banner6 from "../..//assets/icon/banner6.webp";
import banner1Small from "../../assets/icon/banner1-small.webp";
import banner2Small from "../../assets/icon/banner2-small.webp";
import banner3Small from "../../assets/icon/banner3-small.webp";
import banner4Small from "../../assets/icon/banner4-small.webp";
import banner5Small from "../../assets/icon/banner5-small.webp";
import banner6Small from "../../assets/icon/banner6Small.webp";
import banner1Heading from "../../assets/icon/banner1heading.webp";
import banner2Heading from "../../assets/icon/banner2heading.webp";
import banner3Heading from "../../assets/icon/banner3heading.webp";
import banner4Heading from "../../assets/icon/banner4heading.webp";
import banner5Heading from "../../assets/icon/banner5heading.webp";
import banner6Heading from "../../assets/icon/banner6Heading.webp";
import Tippy from "@tippyjs/react/headless";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { faHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import { config } from "../../config";

const cx = classNames.bind(styles);

const dataBanner = [
  {
    id: 575265,
    img: banner1,
    imgSmall: banner1Small,
    heading: banner1Heading,
    desc: "Giới thiệu bộ phim: Sau khi thoát khỏi vụ tai nạn tàu hỏa thảm khốc, Ethan nhận ra The Entity đang được giấu trên một chiếc tàu ngầm cũ của Nga, nhưng một kẻ thù trong quá khứ của anh tên là Gabriel cũng đang truy đuổi.",
  },
  {
    id: 1078605,
    img: banner2,
    imgSmall: banner2Small,
    heading: banner2Heading,
    desc: "Giới thiệu bộ phim: Khi tất cả học sinh trong cùng một lớp bất ngờ biến mất trong cùng một đêm, vào đúng một thời điểm — chỉ trừ lại một em nhỏ duy nhất — cả cộng đồng rơi vào hoang mang tột độ, tự hỏi: ai… hoặc điều gì đứng sau sự biến mất bí ẩn ấy?",
  },
  {
    id: 1061474,
    img: banner3,
    imgSmall: banner3Small,
    heading: banner3Heading,
    desc: "Giới thiệu bộ phim: Superman cố gắng can thiệp vào một cuộc khủng hoảng toàn cầu do Lex Luthor gây ra, nhưng lại bị công chúng hiểu lầm. Mọi chuyện trở nên nghiêm trọng hơn khi Luthor tạo ra một bản sao đen tối của Superman – Ultraman. Với sự giúp đỡ của Lois Lane và chú chó siêu năng lực Krypto ...",
  },
  {
    id: 1022787,
    img: banner4,
    imgSmall: banner4Small,
    heading: banner4Heading,
    desc: "Giới thiệu bộ phim: Gặp Elio, một cậu bé có khả năng dịch chuyển xuyên vũ trụ và bị nhận nhầm thành Đại sứ thiên hà của Trái đất. Phim có America Ferrera đảm nhận lồng tiếng cho nhân vật Olga Solis, Yonas Kibreab lồng tiếng cho Elio ...",
  },
  {
    id: 41513,
    img: banner5,
    imgSmall: banner5Small,
    heading: banner5Heading,
    desc: "Giới thiệu bộ phim: Lão phù thủy độc ác Gargamel rượt đưổi các chú xì - trum ra khỏi ngôi làng của mình. Tình cờ họ đã vô tình lạc vào hang động cấm mà không biết đó chính là Blue moon , một cánh cửa thần kỳ giúp đưa các xì trum đến thời hiện tại ở công viên Trung tâm New York. Họ đã phải nương náu tại nhà ...",
  },
  {
    id: 1083433,
    img: banner6,
    imgSmall: banner6Small,
    heading: banner6Heading,
    desc: "Khi năm người bạn vô tình gây ra một vụ tai nạn xe hơi chết người, họ quyết định che giấu và lập một giao ước giữ bí mật thay vì phải đối mặt với hậu quả. Một năm sau, quá khứ trở lại ám ảnh họ, buộc họ phải đối diện với một sự thật khủng khiếp: có ai đó biết những gì họ đã làm vào mùa hè năm ngoái và quyết tâm trả thù họ ...",
  },
];
function BannerDesign() {
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [activeBanner, setActiveBanner] = useState(false);

  useEffect(() => {
    const fetchIDMovie = async () => {
      const id = dataBanner[activeBannerIdx].id;
      if (!id) return;

      const url = `https://api.themoviedb.org/3/movie/${id}?language=vi-VN`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmFjZDNiOWY0NTJlMjE1ZGY5NzRhMjkyYzQxMmY5MSIsIm5iZiI6MTc1NDczMTQ4OS42Mywic3ViIjoiNjg5NzEzZTFkMDg3NThjYTBlMjY3NzIzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.cEm5zG-WP9ikzUMhq08tUt0XuafbfJOZUozbCYnQxas",
        },
      };
      const res = await fetch(url, options);
      const dataMovie = await res.json();

      // Gửi event và lưu localStorage
      window.dispatchEvent(
        new CustomEvent("changeIdMovie", { detail: dataMovie })
      );
      localStorage.setItem("selectedMovie", JSON.stringify(dataMovie));
    };

    fetchIDMovie();
  }, [activeBannerIdx]);

  const onHandleItem = (idx) => {
    if (idx !== activeBannerIdx) {
      setActiveBannerIdx(idx);
    }
  };

  useEffect(() => {
    setActiveBanner(true);
    const timer = setTimeout(() => setActiveBanner(false), 500);
    return () => clearTimeout(timer);
  }, [activeBannerIdx]);

  return (
    <div className={cx("BannerDesign-Wrapper")}>
      <div className={cx("BannerDesign-inner")}>
        <div className={cx("slide")}>
          <img src={dataBanner[activeBannerIdx].img} alt="" />
          <div className={cx("item-content", { changeItem: activeBanner })}>
            <div className={cx("heading-banner")}>
              <img src={dataBanner[activeBannerIdx].heading} alt="" />
            </div>
            <p className={cx("desc-banner")}>
              {dataBanner[activeBannerIdx].desc}
            </p>
            <div className={cx("list-act")}>
              <a href={config.routes.MovieDetail} className={cx("play-video")}>
                XEM PHIM NGAY
              </a>
            </div>
          </div>

          <div className={cx("list-item")}>
            {dataBanner.map((item, idx) => (
              <div
                key={idx}
                className={cx("item", { active: idx === activeBannerIdx })}
                onClick={() => onHandleItem(idx)}
              >
                <img src={item.imgSmall} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BannerDesign;
// {/* <div className={cx("list-box-icon")}>
//               <div className={cx("box-icon-heart", "box-icon")}>
//                 <button className={cx("icon-heart", "icon")}>
//                   <Tippy content={"Yêu thích"} placement="top">
//                     <FontAwesomeIcon icon={faHeart} className={cx("heart")} />
//                   </Tippy>
//                   {/* <span>Yêu thích</span> */}
//                 </button>
//               </div>
//               <div className={cx("box-icon-plus", "box-icon")}>
//                 <button className={cx("icon-plus", "icon")}>
//                   <Tippy content={"Thêm vào danh sách"} placement="top">
//                     <FontAwesomeIcon icon={faPlus} className={cx("plus")} />
//                   </Tippy>
//                   {/* <span>Thêm vào danh sách</span> */}
//                 </button>
//               </div>
//             </div>
