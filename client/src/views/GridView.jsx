import React, { forwardRef } from "react";
import Loading from "../components/common/Loading";
import { formatCurrency } from "../utils/format";
import { useStateContext } from "../context/StateContext";

const GridView = () => {
  const { data } = useStateContext();

  if (data && data.length > 0)
    return (
      <div className="">
        <div className="p-3 w-full grid lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 ">
          {data.map((item, idx) => (
            <div
              className="p-5 m-1 shadow-md bg-slate-200  inline-block  rounded-md"
              key={idx}
            >
              <div className="flex justify-between">
                <div className="">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-building-columns"></i>
                    {item.Source.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-file-lines"></i>
                    {item.Doc_No}
                  </div>
                </div>
                <div className="font-semibold">
                  <i className="fa-solid fa-money-bill-wave"></i>{" "}
                  {formatCurrency(item.Amount)}
                </div>
              </div>
              <div className="mt-5">
                <i className="fa-solid fa-arrow-right mr-3"></i>
                {item.Content}
              </div>
            </div>
          ))}

          {/* {loading && <Loading />} */}
        </div>
      </div>
    );
};

export default GridView;
