import React, { useState, useEffect, useCallback } from "react";
import logo from "./assets/logo.png";

const highlightKeyword = (text, keyword) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  const highlightedText = text.replace(regex, "<mark>$1</mark>");
  return highlightedText;
};

function App() {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [keywordSearched, setKeywordSearched] = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [timeSearch, setTimeSearch] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAdd, setIsAdd] = useState(false);

  const formatCurrency = useCallback((money) => {
    const config = {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    };
    const formated = new Intl.NumberFormat("vi-VN", config).format(money);
    return formated;
  }, []);

  const handleToUp = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const fetchData = async () => {
    setSearching(true);
    try {
      const response = await fetch("/api/v1");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data = result.data;
      setData(data);
    } catch (error) {
      console.error(error);
    }
    setSearching(false);
  };

  const debounce = (fn, ms) => {
    let timer;

    return function () {
      // Nhận các đối số
      const args = arguments;
      const context = this;

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        fn.apply(context, args);
      }, ms);
    };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      setKeyword(keyword.trim());
      const response = await fetch(`/api/v1/search?q=${keyword.trim()}`);
      const result = await response.json();
      const data = result.metaData.data;
      const totalResults = result.metaData.totalCount;
      const timeSearch = result.metaData.elapsedTime;
      setKeywordSearched(keyword.trim());
      setData(data);
      setTotalResults(totalResults);
      setTimeSearch(timeSearch);
    } catch (error) {
      console.error(error);
    }
    setSearching(false);
  };

  const handleScroll = () => {
    setIsAdd(true);
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1
    ) {
      if (!loading && hasMore) {
        setTotalResults((prev) => prev + 5); // Tăng số trang
      }
    }
    setIsAdd(false);
  };

  useEffect(() => {
    fetchData();
    document.addEventListener("scroll", debounce(handleScroll, 1000));

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-dvh flex flex-col gap-3  ">
      {/* Navbar */}
      <div className="h-16 p-3 flex justify-between bg-gradient-to-b from-slate-300 to-white">
        <div className="">
          <div className="font-semibold">
            Được thực hiện bởi{" "}
            <a
              href="https://github.com/nincode2907"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              Nin
            </a>{" "}
            © 2024
          </div>
          <div className="font-semibold">
            Tham gia hỗ trợ
            <a
              href="https://github.com/NNewbieDev"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 pl-2"
            >
              NNewbieDev
            </a>
          </div>
        </div>
        <div className="font-semibold">
          Dữ liệu được lấy từ{" "}
          <a
            href="https://www.facebook.com/mttqvietnam"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            MTTQ Việt Nam
          </a>{" "}
          từ 01/09/2024 đến 10/09/2024
        </div>
      </div>
      {/* Logo */}
      <div className="flex justify-center">
        <img src={logo} alt="" className="w-96 h-48" />
      </div>
      {/* Search */}
      <div className="flex justify-center sticky top-5">
        <input
          type="text"
          className="border border-slate-300 hover:border-slate-500 mr-2 focus:border-slate-500 outline-none rounded-full py-3 px-5 w-[50%] transition duration-300 ease-in-out"
          placeholder="Tìm kiếm hảo hán..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="border hover:border-slate-500 focus:border-slate-500 outline-none rounded-full py-3 px-5 font-semibold text-white bg-blue-400 hover:bg-blue-500 transition duration-300 ease-in-out"
        >
          Tìm kiếm
        </button>
      </div>
      {/*  */}
      <div className="flex justify-center">
        {totalResults !== 0 && (
          <div>
            <h3 className="">
              Kết quả tìm kiếm cho "<strong>{keywordSearched}</strong>"
            </h3>
            <p className="">
              Hiển thị <b>{data.length}</b> kết quả trong <b>{totalResults}</b>{" "}
              kết quả được tìm thấy trong <b>{timeSearch}s</b>
            </p>
          </div>
        )}

        {totalResults === 0 && keywordSearched && (
          <div>
            <h3 className="">
              Không tìm thấy kết quả cho "<strong>{keywordSearched}</strong>"
            </h3>
          </div>
        )}
      </div>
      {/* Data */}
      <div className="flex justify-center">
        <div className="flex ">
          {data ? (
            <div className="p-3 w-full grid grid-cols-3">
              {data.slice(0, 5 + totalResults).map((item, idx) => (
                <div
                  className="p-5 m-1 shadow-md bg-slate-200  inline-block  rounded-md"
                  key={idx}
                >
                  <div className="flex gap-20">
                    <div className="">
                      <div className="flex items-center gap-2">
                        <i class="fa-solid fa-building-columns"></i>
                        {item.Source.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-file-lines"></i>
                        {item.Doc_No}
                      </div>
                    </div>
                    <div className="font-semibold">
                      <i class="fa-solid fa-money-bill-wave"></i>{" "}
                      {formatCurrency(item.Amount)}
                    </div>
                  </div>
                  <div className="mt-5">
                    <i className="fa-solid fa-arrow-right mr-3"></i>
                    {item.Content}
                  </div>
                </div>
              ))}

              {isAdd && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-300/30 flex justify-center items-center">
                  <i className="fa-solid fa-rotate-right animate-spin text-3xl opacity-50 "></i>
                </div>
              )}
            </div>
          ) : (
            <div className="text-3xl opacity-50 animate-spin">
              <i class="fa-solid fa-rotate-right"></i>
            </div>
          )}
        </div>
      </div>
      {/* Up button */}
      <div className="fixed bottom-10 right-10 ">
        <div
          onClick={handleToUp}
          className="bg-black text-white hover:opacity-40 cursor-pointer w-10 h-10 rounded-full flex justify-center items-center "
        >
          <i className="fa-solid fa-angle-up"></i>
        </div>
      </div>
    </div>
  );
}

export default App;
