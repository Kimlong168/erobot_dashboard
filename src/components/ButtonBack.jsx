import { IoChevronBackCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
const ButtonBack = ({ link }) => {
  return (
    <div className="absolute top-2 md:top-4">
      {/* button back  */}
      <div>
        <Link to={link}>
          <button className="px-1 md:px-4 py-1.5 rounded hover:shadow-xl text-white font-bold bg-red-600 hover:bg-red-700 flex gap-3 justify-center items-center">
            <IoChevronBackCircle /> <span className="hidden md:block">Back</span>
          </button>
        </Link>
      </div>
    </div>
  );
};
ButtonBack.propTypes = {
  link: PropTypes.string.isRequired,
};
export default ButtonBack;
