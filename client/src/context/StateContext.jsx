import React, { createContext, useContext, useEffect, useState } from "react";
import { debounce } from "../utils/performance";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keywordSearched, setKeywordSearched] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [timeSearch, setTimeSearch] = useState(0);
  const [error, setError] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const fetchData = async (api) => {
    setLoading(true);
    try {
      const response = await fetch(api);
      console.log(response);

      if (response.ok) {
        setLoading(false);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { metaData } = await response.json();
      setTotalResults(metaData.totalCount);
      setData(metaData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1
    ) {
      setData([]);
      setPage((prev) => prev + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSearch = async (e) => {
    setIsSearch(true);
    setLoading(true);
    setTotalResults(0);

    const newPage = 1;
    setPage(newPage);
    const keyword = e;

    try {
      const response = await fetch(
        `/api/v1/search?q=${keyword.trim()}&page=${newPage}`
      );
      if (response.status === 200) {
        const { metaData } = await response.json();
        const data = metaData.data;
        const totalResults = metaData.totalCount;
        const timeSearch = metaData.elapsedTime;
        setKeywordSearched(keyword.trim());
        setData(data);
        setTotalResults(totalResults);
        setTimeSearch(timeSearch);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 1000);
    document.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      document.removeEventListener("scroll", debouncedHandleScroll);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isSearch) {
      fetchData(`/api/v1/search?q=&page=${page}`); // Gọi fetchData lần đầu
    }
  }, [page, isSearch]);

  return (
    <MyContext.Provider
      value={{
        data,
        setData,
        page,
        setPage,
        loading,
        keywordSearched,
        setKeywordSearched,
        totalResults,
        timeSearch,
        handleSearch,
        error,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useStateContext = () => useContext(MyContext);
