import Layout from "../layouts/Layout";
import CreateItemCardGroup from "../components/CreateItemCardGroup";
import CardGroup from "../components/CardGroup";

const Dashboard = () => {
  return (
    <Layout>
      <div>
        <CardGroup />
        <p className="text-xl font-semibold my-2">Create new item</p>
        <CreateItemCardGroup />
      </div>
    </Layout>
  );
};

export default Dashboard;
