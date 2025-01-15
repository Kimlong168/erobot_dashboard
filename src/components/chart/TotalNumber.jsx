import { TrendingUp } from "lucide-react";
import NumberCard from "../NumberCard";

export const description = "A mixed bar chart";
import PropTypes from "prop-types";

export default function TotalNumber({ data, date = "all times" }) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 w-full ">
        <NumberCard
          number={data[0].amount}
          title={data[0].name}
          subtitle={`${data[0].name} for ${date}`}
          icon={<TrendingUp />}
        />

        <NumberCard
          number={data[1].amount}
          title={data[1].name}
          subtitle={`${data[1].name} for ${date}`}
          icon={<TrendingUp />}
        />
      </div>
    </>
  );
}

TotalNumber.propTypes = {
  data: PropTypes.array.isRequired,
  date: PropTypes.string,
};
