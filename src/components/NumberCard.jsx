import PropTypes from "prop-types";

const NumberCard = ({ number, title, subtitle, icon }) => {
  return (
    <div className="w-full bg-white border rounded-lg p-4 flex flex-col justify-between">
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="bg-blue-500 rounded-lg p-2 text-white">
          {/* Placeholder for the icon */}
          {icon}
        </div>

        {/* Today's Money */}
        <div>
          <p className="text-gray-500">{title}</p>
          <h2 className="text-3xl font-semibold">{number}</h2>
        </div>
      </div>

      {/* Change Info */}
      <div className="mt-4">
        <p className="text-green-500 text-sm font-semibold">{subtitle}</p>
      </div>
    </div>
  );
};

NumberCard.propTypes = {
  number: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.element,
};

export default NumberCard;
