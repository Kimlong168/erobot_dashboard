import { useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { DataContext } from "../../contexts/DataContext";

const OrderChartByMonth = () => {
  const { numberOfEachOrderStatus } = useContext(DataContext);

  const state = {
    series: [
      numberOfEachOrderStatus.pending,
      numberOfEachOrderStatus.processing,
      numberOfEachOrderStatus.paid,
      numberOfEachOrderStatus.delivered,
      numberOfEachOrderStatus.cancelled,
    ],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Pending", "Processing", "Paid", "Delivered", "Cancelled"],
      title: {
        text: "Order by status",
        align: "left",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="w-full h-full ">
     <div id="chart" className="mt-4">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={380}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default OrderChartByMonth;
