import { useContext } from "react";
import ReactApexChart from "react-apexcharts";
import { DataContext } from "../../contexts/DataContext";

const DonationByStatus = () => {
  const { donorList } = useContext(DataContext);

  const donationSource = donorList.map((data) => data.source);
  let numberOfEachDonationSource = {
    website: donationSource.filter((item) => item === "website").length,
    socialMedia: donationSource.filter((item) => item === "socialMedia").length,
    other: donationSource.filter((item) => item === "other").length,
  };

  const state = {
    series: [
      numberOfEachDonationSource.website,
      numberOfEachDonationSource.socialMedia,
      numberOfEachDonationSource.other,
    ],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Website", "Social Media", "Other"],
      title: {
        text: "Donation by source",
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
    <div className="w-full min-h-full ">
      <div id="chart" className="mt-12">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={390}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default DonationByStatus;
