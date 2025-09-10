import { useEffect, useState } from "react";

export const SearchProvider = () => {
  const [resultSearch, setResultSearch] = useState([]);

  useEffect(() => {
    const dataUpdate = () => {
      const dataSearchResult = JSON.parse(localStorage.getItem("dataSearch"));
      setResultSearch(dataSearchResult);
    };
    dataUpdate();
    localStorage.setItem("dataSearch", JSON.stringify([]));
    window.addEventListener("storage", dataUpdate);
    window.addEventListener("dataSearchUpdate", dataUpdate);
    return () => {
      window.removeEventListener("storage", dataUpdate);
      window.removeEventListener("dataSearchUpdate", dataUpdate);
    };
  }, []);

  return resultSearch;
};
