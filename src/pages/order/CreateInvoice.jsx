import { useContext, useEffect, useRef, useState } from "react";
import Layout from "../../layouts/Layout";
import RedStar from "../../components/RedStar";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import ButtonBack from "../../components/ButtonBack";
import getCurrentDate from "../../utils/getCurrentDate";
import { DataContext } from "../../contexts/DataContext";
import { MdLibraryAdd, MdLibraryAddCheck } from "react-icons/md";
import { FaSquareMinus } from "react-icons/fa6";
import { FaEye, FaPrint, FaSearch } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import Invoice from "./Invoice";
const CreateInvoice = () => {
  const { productList, productCategoryList } = useContext(DataContext);
  const contentToPrint = useRef(null);
  const [invoice, setInvoice] = useState({
    orderId: "",
    customer: "",
    phoneNumber: "",
    address: "",
    totalPrice: 0,
    date: getCurrentDate(),
    remark: "",
    orderItems: [],
  });
  // const [invoice.orderItems, setInvoice.OrderItems] = useState([]);
  const [isPrint, setIsPrint] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");

  // generate order id
  useEffect(() => {
    const fullNameWithoutSpaces = invoice.customer.replace(/\s/g, "");

    setInvoice((prev) => ({
      ...prev,
      orderId: `${fullNameWithoutSpaces}-${parseInt(Date.now() / 1000)}`,
    }));
  }, [invoice.customer, invoice.phoneNumber]);

  // handle print
  const handlePrint = useReactToPrint({
    documentTitle: invoice.orderId,
    onBeforePrint: () => setIsPrint(false),
    onAfterPrint: () => console.log("Printed..."),
    removeAfterPrint: true,
  });

  // handle onChange event for input
  const handleOnChange = (e) => {
    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value,
    });
  };

  // handle onChange event for quantity input
  const handleQuantityChange = (index, value) => {
    const updatedinvoice = [...invoice.orderItems];
    updatedinvoice[index].quantity = value;
    setInvoice((prev) => ({ ...prev, orderItems: updatedinvoice }));
  };

  // handle onClick event for removing an item from invoice.orderItems
  const handleRemoveItem = (id) => {
    const updatedinvoice = [...invoice.orderItems];
    const index = updatedinvoice.findIndex((item) => item.id === id);
    updatedinvoice.splice(index, 1);
    setInvoice((prev) => ({ ...prev, orderItems: updatedinvoice }));
  };

  // create invoice function
  const createInvoice = () => {
    handlePrint(null, () => contentToPrint.current);
  };

  // handle onClick event for adding an item to invoice.orderItems
  const handleAddItem = (item) => {
    if (invoice.orderItems.find((orderItem) => orderItem.id === item.id)) {
      return;
    }

    const newItem = {
      id: item.id,
      name: item.name,
      quantity: 1,
      price: item.price,
    };

    setInvoice((prev) => ({
      ...prev,
      orderItems: [...prev.orderItems, newItem],
    }));
  };

  // calculate total price

  useEffect(() => {
    let totalPrice = 0;
    invoice.orderItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });

    setInvoice((prev) => ({ ...prev, totalPrice: totalPrice }));
  }, [invoice.orderItems]);

  // reset form
  const handleResetForm = () => {
    const confirm = window.confirm("Are you sure to remove all?");
    if (!confirm) return;
    setInvoice((prev) => ({
      ...prev,
      totalPrice: 0,
      orderItems: [],
    }));
  };

  // search product
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");

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
  };

  // filter by category
  useEffect(() => {
    if (filter === "default") {
      setProducts(productList);
    } else {
      const filteredProducts = productList.filter(
        (product) => product.categoryId === filter
      );
      setProducts(filteredProducts);
    }
  }, [filter, productList]);

  return (
    <Layout>
      {" "}
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-gray-400 underline uppercase">
          Create Invoice
        </div>
        <br />

        {/* create product category form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            <div className="flex items-center gap-3">
              <div className="w-full">
                {/* Customer Name input */}
                <label className="font-bold text-xl">
                  Customer Name
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="text"
                  name="customer"
                  value={invoice.customer}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              <div className="w-full">
                {/* address input */}
                <label className="font-bold text-xl">Address</label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="text"
                  name="address"
                  value={invoice.address}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-full">
                {/* phone number input */}
                <label className="font-bold text-xl">Phone Number</label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="text"
                  name="phoneNumber"
                  value={invoice.phoneNumber}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className="w-full">
                {/* date input */}
                <label className="font-bold text-xl">
                  Date
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="date"
                  name="date"
                  value={invoice.date}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>

            {/* remark input */}
            <label className="font-bold text-xl">Remark</label>
            <textarea
              placeholder="Remark..."
              rows={2}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="remark"
              value={invoice.remark}
              onChange={(e) => handleOnChange(e)}
            />

            <div className="flex flex-col xl:flex-row gap-5">
              {/* selected products */}
              <div className="w-full order-2  xl:order-1">
                <div className="flex justify-between items-center  mb-3">
                  <h2 className="text-xl text-green-500 font-bold">
                    Selected Products
                  </h2>
                  <button
                    onClick={handleResetForm}
                    className="px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
                  >
                    Remove All
                  </button>
                </div>
                <div className="w-full overflow-hidden rounded-lg shadow-xs">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                          <th className="px-4 py-3">Product Name</th>
                          <th className="px-4 py-3">Quantity</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                        {/* if no selected item */}
                        {invoice.orderItems &&
                          invoice.orderItems.length === 0 && (
                            <tr className=" text-center">
                              <td
                                className="py-8 text-white font-bold"
                                colSpan={8}
                              >
                                No selected products
                              </td>
                            </tr>
                          )}

                        {invoice.orderItems &&
                          invoice.orderItems.map((item, index) => (
                            <tr
                              className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                              key={index}
                            >
                              <td className="px-4 py-3">{item.name}</td>
                              <td className="px-4 py-3">
                                {/* <input
                                  type="number"
                                  min={1}
                                  className="border border-gray-700 bg-transparent pl-2 rounded outline-none w-20 "
                                  value={item.quantity}
                                  onChange={(e) => {
                                    if (e.target.value < 1) return;
                                    handleQuantityChange(index, e.target.value);
                                  }}
                                /> */}

                                <div className="custom-number-input h-10 w-32 mx-auto">
                                  <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                    {/* minus button */}
                                    <button
                                      onClick={() => {
                                        if (item.quantity < 2) return;

                                        handleQuantityChange(
                                          index,
                                          parseFloat(item.quantity) - 1
                                        );
                                      }}
                                      className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                                    >
                                      <span className="m-auto text-2xl font-thin">
                                        −
                                      </span>
                                    </button>

                                    {/* input quantity */}
                                    <input
                                      type="number"
                                      className="focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
                                      name="custom-input-number"
                                      min={1}
                                      value={item.quantity}
                                      onChange={(e) => {
                                        if (e.target.value < 1) return;
                                        handleQuantityChange(
                                          index,
                                          e.target.value
                                        );
                                      }}
                                    ></input>

                                    {/* plus button */}
                                    <button
                                      onClick={() => {
                                        handleQuantityChange(
                                          index,
                                          parseFloat(item.quantity) + 1
                                        );
                                      }}
                                      className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                                    >
                                      <span className="m-auto text-2xl font-thin">
                                        +
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">{item.price}</td>
                              <td className="px-4 py-3">
                                {item.quantity * item.price} $
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className=" text-red-600 hover:text-red-700 bg-white/80 rounded"
                                >
                                  <FaSquareMinus size={26} />
                                </button>
                              </td>
                            </tr>
                          ))}

                        {invoice.orderItems &&
                          invoice.orderItems.length > 0 && (
                            <tr>
                              <td
                                colSpan="3"
                                className="px-4 py-3 dark:text-white font-bold text-md text-right"
                              >
                                Total Price:
                              </td>
                              <td
                                colSpan="2"
                                className="px-4 py-3 dark:text-white font-bold text-md"
                              >
                                {invoice.totalPrice} $
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"></div>
                </div>
              </div>

              {/* product list*/}
              <div className="w-full order-1 xl:order-2">
                <div className="flex flex-col items-start lg:flex-row lg:items-center lg:gap-10 lg:justify-between mb-2">
                  <h2
                    className="text-xl mb-2 text-blue-500 font-bold cursor-pointer"
                    onClick={() => {
                      // reset search and filter
                      setProducts(productList);
                    }}
                  >
                    Products
                  </h2>

                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      {/* filter by category */}
                      <select
                        className="outline-none rounded px-3 cursor-pointer border border-gray-600 bg-transparent font-bold"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="default">All Categories</option>

                        {productCategoryList.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      {/* search bar */}
                      <form className="o" onSubmit={handleSearch}>
                        <div className="flex items-center gap-3 px-4 border border-gray-600 rounded">
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
                    </div>
                  </div>
                </div>
                <div className="w-full overflow-hidden rounded-lg shadow-xs bg-gray-700">
                  <div
                    className={`w-full ${
                      productList.length != 0 && "h-[450px]"
                    } overflow-auto`}
                  >
                    <table className="w-full relative ">
                      <thead className="sticky top-0">
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                          <th className="px-4 py-3">Product Name</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Select</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                        {products.length === 0 && (
                          <tr className=" text-center">
                            <td
                              className="py-8 text-white font-bold"
                              colSpan={8}
                            >
                              No products found!
                            </td>
                          </tr>
                        )}

                        {products &&
                          products.map((item, index) => {
                            const isSelected = invoice.orderItems.find(
                              (orderItem) => orderItem.id === item.id
                            );

                            return (
                              <tr
                                className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                                key={index}
                              >
                                <td className="px-4 py-3 gap-4">{item.name}</td>
                                <td className="px-4 py-3">{item.price} $</td>
                                <td className="px-4 py-3">
                                  {isSelected ? (
                                    <button
                                      onClick={() => handleRemoveItem(item.id)}
                                    >
                                      <MdLibraryAddCheck
                                        size={26}
                                        className="text-green-500 hover:text-green-700"
                                      />
                                    </button>
                                  ) : (
                                    <button onClick={() => handleAddItem(item)}>
                                      <MdLibraryAdd
                                        size={26}
                                        className="text-blue-500 hover:text-blue-700"
                                      />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"></div>
                </div>
              </div>
            </div>

            {/* print and preview */}
            <div className="flex items-center justify-end mt-4 gap-4">
              <button
                onClick={() => setIsPreview((prev) => !prev)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 mt-2 rounded flex justify-center items-center gap-3"
              >
                <FaEye /> <span>{isPreview && "Close"} Preview</span>
              </button>
              <button
                className="bg-green-600 hover:bg-green-800 text-white font-bold p-2 mt-2 rounded flex justify-center items-center gap-3"
                onClick={() => {
                  if (invoice.orderItems.length === 0 || !invoice.customer) {
                    notify();
                    return;
                  }

                  setIsPrint(true);
                  setIsPreview(true);

                  if (!isPreview) {
                    setTimeout(() => {
                      createInvoice();
                    }, 1000);
                  } else {
                    createInvoice();
                  }
                }}
              >
                <FaPrint />{" "}
                <span>{!isPrint ? "Print or Save Invoice" : "Loading..."}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invoice */}
        {isPreview && (
          <div className="overflow-auto w-full">
            <div className="mt-5 w-fit mx-auto shadow-xl border rounded-lg overflow-hidden">
              <div ref={contentToPrint}>
                <Invoice {...invoice} totalPrice={invoice.totalPrice} />
              </div>
            </div>
          </div>
        )}

        {/* toast alert */}
        <Toast />

        {/* button back */}
        <ButtonBack link="/" />
      </div>
    </Layout>
  );
};

export default CreateInvoice;
