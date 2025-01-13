import Layout from "../../layouts/Layout";
import { useContext, useEffect, useState } from "react";
import TableHead from "../../components/TableHead";
import { toast } from "react-toastify";
import Toast from "../../utils/Toast";
import { toastProps } from "../../utils/toastProp";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { UpdateContext } from "../../contexts/UpdateContext";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase-config";
import LoadingInTable from "../../components/LoadingInTable";
import { DataContext } from "../../contexts/DataContext";
import { FaSearch } from "react-icons/fa";
import { TbMathEqualLower } from "react-icons/tb";
import PropType from "prop-types";
import Pagination from "./Pagination";

const Product = () => {
  const { productList, productCategoryList, setShowNotification } =
    useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);

  const [products, setProducts] = useState(productList);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100);
  const [minPrice, setMinPrice] = useState(1);
  const [priceRange, setPriceRange] = useState(maxPrice || 100);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  useEffect(() => {
    if (productList && productList.length > 0) {
      let maxPrice = Math.max(
        ...productList.map((product) => parseFloat(product.price))
      );

      let minPrice = Math.min(
        ...productList.map((product) => parseFloat(product.price))
      );
      setMinPrice(parseInt(minPrice + 1));
      setMaxPrice(parseInt(maxPrice + 1));
    }
  }, [productList]);

  // delete product notify
  const notifyDeleting = (id, imageId) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "products")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(imageId);
                  setShowNotification({
                    status: true,
                    action: "deleted",
                    item: "product",
                  });
                }
              }) // This will log true if the item was deleted successfully
              .catch((error) => console.error(error));
          }}
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  // delete image from firebase storage
  const deleteImageFromStorage = (imageId) => {
    const storageRef = ref(storage, `productImages/${imageId}`);
    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        console.log("image deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  // search product
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");
    setPriceRange(maxPrice);
    let searchedproduct = [];

    // seach product base on name, productCode or price
    if (!isNaN(searchKeyword)) {
      searchedproduct = productList.filter(
        (product) =>
          product.price
            .toString()
            .includes(searchKeyword.toLowerCase().trim()) ||
          product.productCode.toLowerCase() ===
            searchKeyword.toLowerCase().trim()
      );
    } else {
      searchedproduct = productList.filter((product) =>
        product.name
          .toLowerCase()
          .includes(
            searchKeyword.toLowerCase().trim() ||
              product.productCode.toLowerCase() ===
                searchKeyword.toLowerCase().trim()
          )
      );
    }

    setProducts(searchedproduct);
    setIsSearched(true);
  };

  //  filter base on category and status
  useEffect(() => {
    let filteredProduct = [];
    if (filter === "default") {
      filteredProduct = productList;
    } else if (filter == "active") {
      filteredProduct = productList.filter((product) => product.isActive);
    } else if (filter == "inactive") {
      filteredProduct = productList.filter((product) => !product.isActive);
    } else {
      filteredProduct = productList.filter(
        (product) => product.categoryId === filter
      );
    }
    setProducts(filteredProduct);
    setIsSearched(false);
    // setPriceRange(maxPrice);
  }, [filter, productList, maxPrice]);

  // filter product base on price

  useEffect(() => {
    let filteredProduct = productList.filter(
      (product) =>
        parseFloat(product.price) >= 0 &&
        parseFloat(product.price) <= priceRange
    );

    setProducts(filteredProduct);
    setIsSearched(false);
    setFilter("default");
  }, [priceRange, productList]);

  return (
    <Layout>
      <TableHead
        color="red"
        title={`Products (${productList.length})`}
        border="border-red-600 text-red-600"
        link="/createProduct"
      />

      {/* search, sort and filter component */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        {/* show all product button */}
        <button
          onClick={() => {
            setProducts(productList);
            setFilter("default");
            setSearchKeyword("");
            setPriceRange(maxPrice);
          }}
          className="px-4 py-2 font-bold border bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl rounded w-fit"
        >
          Show all
        </button>
        {/* search bar */}
        <form className="w-full lg:w-auto " onSubmit={handleSearch}>
          <div className="flex  items-center gap-3 px-4 py-1.5 border">
            {/* search input */}
            <input
              className="outline-none border-none p-1 w-full"
              type="text"
              placeholder="Search..."
              name="search"
              value={searchKeyword}
              // onBlur={() => setIsSearched(false)}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                handleSearch(e);
              }}
            />

            {/* search icon */}
            <div onClick={handleSearch}>
              <FaSearch />
            </div>
          </div>
        </form>

        {/* filter by category */}
        <select
          className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="default">All Categories</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          {productCategoryList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>

        {/* price range */}
        <div className="px-4 py-2 ">
          <PriceRangeFilter
            maxPrice={maxPrice}
            minPrice={minPrice}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        {/* update record per page */}
        {productList && productList.length > 5 && (
          <select
            onChange={(e) => setRecordsPerPage(e.target.value)}
            name="recordsPerPage"
            className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            {productList.length >= 25 && (
              <option value="25">25 per page</option>
            )}
            {productList.length >= 50 && (
              <option value="50">50 per page</option>
            )}
            {productList.length >= 75 && (
              <option value="75">75 per page</option>
            )}
            {productList.length >= 100 && (
              <option value="100">100 per page</option>
            )}
            <option value={productList.length}>All per page</option>
          </select>
        )}
      </div>

      {/* result search for text */}
      {isSearched && searchKeyword.length !== 0 && (
        <div className="mt-4 mb-2">
          Search result for{" "}
          <span className="text-primary font-bold">
            &quot;{searchKeyword}&ldquo;
          </span>
        </div>
      )}

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {/* loading */}
              {productList && productList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={10}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}

              {/* not found */}
              {productList &&
                productList.length > 0 &&
                products &&
                products.length == 0 && (
                  <>
                    <tr className=" text-center">
                      <td
                        className="py-8 dark:text-white font-bold "
                        colSpan={10}
                      >
                        {/* loading */}
                        No products found!
                      </td>
                    </tr>
                  </>
                )}

              {/* display data with pagination */}
              <Pagination
                products={products}
                notifyDeleting={notifyDeleting}
                numberOfRecordsPerPage={recordsPerPage}
              />
            </tbody>
          </table>
        </div>
        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"></div>
      </div>

      {/* toast alert */}
      <Toast />
    </Layout>
  );
};

// price range filter component
const PriceRangeFilter = ({
  maxPrice = 500,
  minPrice = 1,
  priceRange,
  setPriceRange,
}) => {
  const handleChange = (event) => {
    setPriceRange(parseInt(event.target.value));
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="flex items-center">
        <label className="mr-2 font-bold whitespace-pre">Price Range:</label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={(event) => handleChange(event)}
          className="slider appearance-none w-24 lg:w-36 h-1 md:h-2 bg-yellow-500 rounded-full outline-none cursor-pointer"
        />
        <span className="ml-2 flex items-center gap-2 whitespace-pre">
          <TbMathEqualLower /> {priceRange} $
        </span>
      </div>
    </div>
  );
};

PriceRangeFilter.propTypes = {
  maxPrice: PropType.number,
  minPrice: PropType.number,
  priceRange: PropType.number,
  setPriceRange: PropType.func,
};

export default Product;
