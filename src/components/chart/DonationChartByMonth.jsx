import { useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { DataContext } from "../../contexts/DataContext";

const DonationChartByMonth = () => {
  const { donorList } = useContext(DataContext);
  const monthlyTotals = Array(12).fill(0);
  const monthlyTotalsPreviousYear = Array(12).fill(0);

  console.log("donorList", donorList);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Process the donorList to calculate totals
  donorList.forEach((donor) => {
    const [year, month, day] = donor.date.split("-"); // Split date
    console.log("day", day, "month", month, "year", year);
    if (parseInt(year) === currentYear) {
      const monthIndex = parseInt(month) - 1; // Convert month to 0-based index
      monthlyTotals[monthIndex] += parseFloat(donor.amount);
    }

    if (parseInt(year) === currentYear - 1) {
      const monthIndex = parseInt(month) - 1; // Convert month to 0-based index
      monthlyTotalsPreviousYear[monthIndex] += parseFloat(donor.amount);
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
        text: "Donation ($) by Month",
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
      <div id="chart" className="mt-12">
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

export default DonationChartByMonth;
