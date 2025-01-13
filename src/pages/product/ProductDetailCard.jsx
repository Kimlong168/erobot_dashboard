import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { MdOutlineOpenWith } from "react-icons/md";
import { IoChevronBackCircle } from "react-icons/io5";
import PopupImage from "../../components/PopupImage";
import ContentDisplay from "../../components/ContentDisplay";
const DetailProductCard = ({
  name,
  price,
  productCode,
  image,
  categoryId,
  detail,
  description,
  isActive,
  productCategoryList,
  productParams,
}) => {
  const [showImage, setShowImage] = useState(false);
  return (
    <div className="flex items-center justify-center ">
      <div className="prose lg:prose-xl prose-a:no-underline prose-img:m-0">
        <div className="relative border flex w-full max-w-[48rem] flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
          <div
            onClick={() => setShowImage(true)}
            className="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700"
          >
            {/* product image */}
            <img src={image} className="h-full w-full object-cover" />
            {/* open button */}
            <div className="absolute top-0 text-white rounded-br-lg cursor-pointer bg-green-600 grid place-content-center w-[30px] h-[30px]">
              <MdOutlineOpenWith />
            </div>
          </div>

          {/* product information */}
          <div className="p-6 mt-5 overflow-auto">
            <h6 className="mb-4 block font-sans text-3xl font-semibold uppercase leading-relaxed tracking-normal  antialiased">
              <span className="text-pink-500">{name}</span>
            </h6>
            <h4 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              <span className="text-pink-500">Category: </span>
              {productCategoryList.map((data) => {
                if (data.id == categoryId) {
                  return data.categoryName;
                }
              })}
            </h4>
            <h4 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              <span className="text-pink-500">Price: </span> {price} $
            </h4>
            <h4 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              <span className="text-pink-500">Product Code: </span>{" "}
              {productCode ? productCode : "No code"}
            </h4>
            <h4 className="mb-2 font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased flex items-center gap-3">
              <span className="text-pink-500">Status: </span>
              {isActive ? (
                <span className="p-2 py-0.5 rounded border text-sm border-green-600 text-green-600 bg-green-600/10">
                  Active
                </span>
              ) : (
                <span className="p-2 py-0.5 rounded border text-sm border-red-600 text-red-600 bg-red-600/10">
                  Inactive
                </span>
              )}
            </h4>
            <h4 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              <span className="text-pink-500">Description: </span> {description}
            </h4>
          </div>

          {/* button back and edit */}
          <div className="flex items-center gap-2 absolute right-0">
            <div>
              <Link to="/product">
                <button className="px-4 py-1.5 rounded hover:shadow-xl text-sm text-white font-bold bg-red-600 flex gap-3 justify-center items-center">
                  <IoChevronBackCircle /> Back
                </button>
              </Link>
            </div>
            <div>
              <Link to={`/updateProduct/${productParams}`}>
                <button className="px-4 py-1.5 rounded hover:shadow-xl text-sm text-white font-bold bg-green-600 flex gap-3 justify-center items-center">
                  <FiEdit /> Edit
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* detail of the product */}
        <div className="rounded-xl mx-auto shadow-xl border w-full font-khmer p-2 md:p-5 pt-0 mt-5 ">
          <div className="mb-2 mt-3 sm:mt-0 block text-xl font-semibold text-blue-gray-900 antialiased bg-pink-400 text-white p-4 py-2 rounded-md">
            Detail:
          </div>

          {detail.trim() === "<p><br></p>" || detail.trim() === "" ? (
            <div className="text-center font-bold py-5">No detail</div>
          ) : (
            <p className="mb-8 lock leading-relaxed text-gray-700 antialiased prose-img:m-4">
              <div className="prose lg:prose-xl prose-img:w-full lg:prose-img:w-auto prose-img:mx-auto prose-img:block prose-a:text-blue-600 prose-a:hover:text-blue-400 rounded mx-auto  w-full font-khmer p-2 md:p-5">
                {/* Use dangerouslySetInnerHTML to render HTML content */}
                <ContentDisplay htmlString={detail} />
              </div>
            </p>
          )}
        </div>

        {/* popup product image */}
        {showImage && (
          <div className="absolute top-0 right-0">
            <PopupImage image={image} setShowImage={setShowImage} />
          </div>
        )}
      </div>
    </div>
  );
};
DetailProductCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  productCode: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  productCategoryList: PropTypes.array.isRequired,
  productParams: PropTypes.string.isRequired,
};
export default DetailProductCard;
