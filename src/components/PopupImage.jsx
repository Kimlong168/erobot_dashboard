import PropTypes from "prop-types";
import { AiOutlineFullscreenExit } from "react-icons/ai";

const PopupImage = ({ setShowImage, image }) => {
  return (
    <div className="relative bg-red-700 ">
      <div className="fixed inset-0  bg-black/70 z-[1000] flex justify-center items-center p-4">
        <div
          onClick={() => setShowImage(false)}
          className="relative max-w-[500px] max-h-[600px]   overflow-hidden border-2 border-gray-700 rounded-xl"
        >
          {/* image */}
          <img
            className="object-fill w-full h-full "
            src={image}
            alt={image}
          />
          {/* icon */}
          <div className="absolute top-0 right-0 cursor-pointer bg-red-500 rounded-bl-lg p-1.5  text-white font-bold">
            <AiOutlineFullscreenExit />
          </div>
        </div>
      </div>
    </div>
  );
};
PopupImage.propTypes = {
  setShowImage: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
};
export default PopupImage;
