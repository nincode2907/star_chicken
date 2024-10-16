import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useStateContext } from "../context/StateContext";

const ChartView = () => {
  const { data } = useStateContext();

  if (data && data.length > 0) {
    return (
      <div className="min-h-96 ">
        <Line
          style={{ width: "1000px" }}
          data={{
            datasets: [
              {
                label: "Tiền đã quyên góp ",
                data: data.map((item) => item.Amount),
              },
            ],
            labels: data.map((item) => item.Doc_No),
          }}
        />
      </div>
    );
  }
};

export default ChartView;
