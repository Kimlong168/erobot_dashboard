import Layout from "../layouts/Layout";
import CreateItemCardGroup from "../components/CreateItemCardGroup";
import CardGroup from "../components/CardGroup";
import TotalNumber from "../components/chart/TotalNumber";
import OrderChartByMonth from "../components/chart/OrderChartByMonth";
import { DataContext } from "../contexts/DataContext";
import { useContext } from "react";
import DonationChartByMonth from "../components/chart/DonationChartByMonth";
import OrderByStatus from "../components/chart/OrderByStatus";
import DonationByStatus from "../components/chart/DonationByStatus";
const Dashboard = () => {
  const {
    donorList,
    orderList,
    // numberOfEachOrderStatus,
  } = useContext(DataContext);

  const totalAmountOfOrder = orderList.reduce(
    (acc, order) => acc + parseFloat(order.total),
    0
  );
  const totalAmountOfDonation = donorList.reduce(
    (acc, donor) => acc + parseFloat(donor.amount),
    0
  );

  return (
    <Layout>
      <div>
        <p className="text-xl font-semibold mb-2">Statistic</p>
        <TotalNumber
          data={[
            // { name: "Total Reveneu", amount: data.total_revenue.toFixed(2) },
            {
              name: "Total Product Order",
              amount: `${orderList.length} (${totalAmountOfOrder} $) `,
            },
            {
              name: "Total Donors",
              amount: `${donorList.length} (${totalAmountOfDonation} $) `,
            },
            // { name: "Total Product Sold", amount: data.total_products_sold },
          ]}
        />
        <div className="flex flex-col lg:flex-row gap-4 mb-12">
          {" "}
          <OrderChartByMonth />
          <DonationChartByMonth />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mb-12">
          {" "}
          <OrderByStatus /> <DonationByStatus />
        </div>
        <CardGroup />
        <p className="text-xl font-semibold my-2">Create new item</p>
        <CreateItemCardGroup />
      </div>
    </Layout>
  );
};

export default Dashboard;
