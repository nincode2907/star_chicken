import React from "react";
import logo from "./assets/logo.png";
import DropDown from "./components/common/DropDown";
import DropDownList from "./components/common/DropDownList";
import { debounce, handleToUp } from "./utils/performance";
import { Link, Outlet } from "react-router-dom";
import { useStateContext } from "./context/StateContext";
import Loading from "./components/common/Loading";

function App() {
  const {
    data,
    loading,
    keywordSearched,
    handleSearch,
    totalResults,
    timeSearch,
    error,
  } = useStateContext();

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
      <div className="flex sticky top-5 justify-between px-10">
        <div className=" basis-1/2 flex items-center justify-start gap-4">
          <DropDownList
            relative={
              <DropDown
                icon={<i className="fa-solid fa-eye "></i>}
                title={"Chế độ xem"}
              />
            }
          >
            <Link to="/chart">
              <DropDown
                icon={<i className="fa-solid fa-chart-simple"></i>}
                title={"Biểu đồ"}
              />
            </Link>
            <Link to="/">
              <DropDown
                icon={<i className="fa-solid fa-table-cells"></i>}
                title={"Lưới"}
              />
            </Link>
          </DropDownList>
        </div>
        <div className="basis-1/2 flex items-center justify-end">
          <input
            type="text"
            className="border border-slate-300 hover:border-slate-500 mr-2 focus:border-slate-500 outline-none rounded-full py-3 px-5 w-[50%] transition duration-300 ease-in-out"
            placeholder="Tìm kiếm hảo hán..."
            onChange={debounce((e) => {
              handleSearch(e.target.value);
            }, 1000)}
          />
        </div>
      </div>
      {/*  */}
      <div className="flex px-10 justify-end">
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

        {error && totalResults === 0 && (
          <div>
            <h3 className="">
              Không tìm thấy kết quả cho "<strong>{keywordSearched}</strong>"
            </h3>
          </div>
        )}
      </div>
      {/* Data */}
      <div className="flex justify-center w-full">
        <div className="flex ">{!loading ? <Outlet /> : <Loading />}</div>
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
