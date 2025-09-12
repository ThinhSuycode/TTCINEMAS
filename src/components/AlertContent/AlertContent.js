import classNames from "classnames/bind";
import styles from "./AlertContent.module.scss";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClose } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function AlertContent({ alertList, setAlertList }) {
  const [hidingIds, setHidingIds] = useState([]);
  const handleClose = (id) => {
    setHidingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setAlertList((prev) => prev.filter((a) => a.id !== id));
      setHidingIds((prev) => prev.filter((h) => h !== id));
    }, 750);
  };

  useEffect(() => {
    alertList.forEach((alert) => {
      const timer = setTimeout(() => {
        handleClose(alert.id);
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [alertList]);

  return (
    <div className={cx("alertListContent")}>
      {alertList.map((item) => (
        <div
          key={item.id}
          className={cx("alert-item", {
            hiddenAlert: hidingIds.includes(item.id),
          })}
        >
          <div className={cx("alert-left")}>
            <span className={cx("alert-icon")}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </span>
            <span>{item.message}</span>
          </div>
          <div
            className={cx("alert-close")}
            onClick={() => handleClose(item.id)}
          >
            <FontAwesomeIcon icon={faClose} />
          </div>
          <div className={cx("loading-hide")}></div>
        </div>
      ))}
    </div>
  );
}

export default AlertContent;
