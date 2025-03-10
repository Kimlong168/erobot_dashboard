import { useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { DataContext } from "../../contexts/DataContext";

const OrderChartByMonth = () => {
  const { orderList } = useContext(DataContext);
  const monthlyTotals = Array(12).fill(0);
  const monthlyTotalsPreviousYear = Array(12).fill(0);

  console.log("orderList", orderList);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Process the orderList to calculate totals
  orderList.forEach((order) => {
    const [day, month, year] = order.date.split(",")[0].split("/"); // Split date
    console.log("day", day, "month", month, "year", year);
    if (parseInt(year) === currentYear) {
      const monthIndex = parseInt(month) - 1; // Convert month to 0-based index
      monthlyTotals[monthIndex] += parseFloat(order.total);
    }

    if (parseInt(year) === currentYear - 1) {
      const monthIndex = parseInt(month) - 1; // Convert month to 0-based index
      monthlyTotalsPreviousYear[monthIndex] += parseFloat(order.total);
    }
  });

  // Output the monthly totals as an array
  console.log("Monthly Totals for the Current Year:", monthlyTotals);
  const state = {
    series: [
      {
        name: `${currentYear} (Total $)`,
        data: monthlyTotals,
      },
      {
        name: `${currentYear - 1} (Total $)`,
        data: monthlyTotalsPreviousYear,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Order ($) by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  };

  return (
    <div className="w-full">
      <div id="chart" className="mt-4">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default OrderChartByMonth;
