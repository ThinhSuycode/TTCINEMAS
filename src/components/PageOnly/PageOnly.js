import style from "./PageOnly.module.scss";
import classNames from "classnames/bind";
import { Header, Footer } from "../../layout";
import { useState, useEffect } from "react";

const cx = classNames.bind(style);

function PageOnly({ children }) {
  return (
    <div className={cx("Wrapper")}>
      <Header></Header>
      <div className={cx("container")}>
        <div className={cx("content")}>{children}</div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default PageOnly;
