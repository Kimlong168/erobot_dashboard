import { useContext, useEffect, useState } from "react";
import { UpdateContext } from "../../contexts/UpdateContext";
import PropType from "prop-types";
import Layout from "../../layouts/Layout";
import TableHead from "../../components/TableHead";
import Toast from "../../utils/Toast";
import { toast } from "react-toastify";
import { toastProps } from "../../utils/toastProp";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import LoadingInTable from "../../components/LoadingInTable";
import { DataContext } from "../../contexts/DataContext";
import { db } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { FaSearch } from "react-icons/fa";
import { TbMathEqualLower } from "react-icons/tb";
import Pagination from "./Pagination";
import ExportToExcel from "../../components/ExportToExcel";
import ExportToPDF from "../../components/ExportToPDF";

const Order = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const { orderList } = useContext(DataContext);
  const [isStatusUpdated, setIsStatusUpdated] = useState({
    status: false,
    id: "1",
  });

  const [orders, setOrders] = useState(orderList);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [maxTotalPrice, setMaxTotalPrice] = useState(1000);
  const [minTotalPrice, setMinTotalPrice] = useState(1);
  const [priceRange, setPriceRange] = useState(maxTotalPrice);
  // filter order base on date
  const [orderExistDate, setOrderExistDate] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  // get order exist date to filter
  useEffect(() => {
    if (orderList && orderList.length > 0) {
      let existDate = orderList.map((order) => order.date.slice(0, 10));
      // remove duplicate date
      existDate = [...new Set(existDate)];
      setOrderExistDate(existDate);
    }
  }, [orderList]);

  // get the max total price
  useEffect(() => {
    if (orderList && orderList.length > 0) {
      let maxPrice = Math.max(
        ...orderList.map((item) => parseFloat(item.total))
      );

      let minPrice = Math.min(
        ...orderList.map((item) => parseFloat(item.total))
      );
      setMinTotalPrice(parseInt(minPrice + 1));
      setMaxTotalPrice(parseInt(maxPrice + 1));
      setPriceRange(parseInt(maxPrice + 1));
    }
  }, [orderList]);

  // delet eOrder notify
  const notifyDeleting = (id) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            const confirm = deleteItemFucntion(id, "orders");

            if (confirm) {
              setShowNotification({
                status: true,
                item: "order",
                action: "deleted",
              });
            }
          }}
          // to update the data in the table
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  //   handle change status
  const handleChangeStatus = (e, id) => {
    const newStatus = e.target.value;
    updateOrderStatus(newStatus, id);
  };

  //   update Order
  async function updateOrderStatus(newStatus, id) {
    const docRef = doc(db, "orders", id);

    await setDoc(
      docRef,
      {
        status: newStatus,
      },
      { merge: true }
    );

    // to update the data in the table
    setIsUpdated((prev) => !prev);

    // to show the updating status
    setIsStatusUpdated({
      status: true,
      id: id,
    });

    // show notification
    setShowNotification({
      status: true,
      item: "order",
      action: "update",
    });

    // to remove the notification
    setTimeout(() => {
      setShowNotification({
        status: false,
        item: "order",
        action: "update",
      });
    }, 2000);

    console.log("order status updated");
  }

  // This effect will trigger whenever isStatusUpdated changes
  useEffect(() => {
    if (isStatusUpdated.status) {
      // Reset state after 1 second

      const timeoutId = setTimeout(() => {
        setIsStatusUpdated({
          status: false,
          id: null,
        });
      }, 2000);

      // Clear the timeout if the component unmounts or isStatusUpdated changes
      return () => clearTimeout(timeoutId);
    }
  }, [isStatusUpdated.status]);

  // search order by total price, customer name, phone or order id
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");
    setPriceRange(maxTotalPrice);
    let searchedorder = [];

    // seach order base on name, orderCode or price
    if (!isNaN(searchKeyword)) {
      searchedorder = orderList.filter(
        (order) =>
          order.total.toString().includes(searchKeyword.toLowerCase().trim()) ||
          order.phoneNumber
            .toLowerCase()
            .includes(searchKeyword.toLowerCase().trim())
      );
    } else {
      searchedorder = orderList.filter(
        (order) =>
          order.fullName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase().trim()) ||
          order.orderId
            .toLowerCase()
            .includes(searchKeyword.toLowerCase().trim())
      );
    }
    // to display the result
    setOrders(searchedorder);

    // to show the search result text
    setIsSearched(true);

    // set everything to default
    setPriceRange(maxTotalPrice);
  };

  //  filter base on status
  useEffect(() => {
    let filteredOrder = [];
    if (filter == "pending") {
      filteredOrder = orderList.filter((order) => order.status === "pending");
    } else if (filter == "processing") {
      filteredOrder = orderList.filter(
        (order) => order.status === "processing"
      );
    } else if (filter == "paid") {
      filteredOrder = orderList.filter((order) => order.status === "paid");
    } else if (filter == "delivered") {
      filteredOrder = orderList.filter((order) => order.status === "delivered");
    } else if (filter == "cancelled") {
      filteredOrder = orderList.filter((order) => order.status === "cancelled");
    } else {
      filteredOrder = orderList;
    }

    setOrders(filteredOrder);

    // reset everything to default
    setIsSearched(false);
    setSearchKeyword("");
  }, [filter, orderList, maxTotalPrice]);

  useEffect(() => {
    let filteredOrder = [];
    if (filterDate === "default") {
      filteredOrder = orderList;
    } else {
      filteredOrder = orderList.filter((order) =>
        order.date.includes(filterDate)
      );
    }

    setOrders(filteredOrder);

    // reset everything to default
    setIsSearched(false);
    setSearchKeyword("");
  }, [filterDate, orderList]);

  // filter order base on payment method
  useEffect(() => {
    let filteredOrder = [];
    if (filterPaymentMethod === "default") {
      filteredOrder = orderList;
    } else {
      filteredOrder = orderList.filter(
        (order) => order.paymentMethod === filterPaymentMethod
      );
    }

    setOrders(filteredOrder);

    // reset everything to default
    setIsSearched(false);
    setSearchKeyword("");
  }, [filterPaymentMethod, orderList]);

  // filter order base on total price
  useEffect(() => {
    let filteredOrder = orderList.filter(
      (order) =>
        parseFloat(order.total) >= 0 && parseFloat(order.total) <= priceRange
    );

    setOrders(filteredOrder);

    // reset everything to default
    setIsSearched(false);
    setFilterDate("default");
    setFilter("default");
    setSearchKeyword("");
  }, [priceRange, orderList]);

  const dataToExport = orders.map((item, index) => {
    return {
      No: index + 1,
      "Order ID": item.orderId,
      Customer: item.fullName,
      Address: item.address,
      Phone: item.phoneNumber,
      Contact: item.contactLink,
      "Payment Method": item.paymentMethod,
      Date: item.date,
      Total: item.total,
      Status: item.status,
      Remark: item.message,
      // to view the order
      View: `https://dashboard.erobotkh.org/orderDetail/${item.id}`,
    };
  });

  return (
    <Layout>
      <TableHead
        color="rgb(219,39,119)"
        title={`Customer Order (${orderList.length})`}
        border="border-pink-600 text-pink-600"
        link="/createInvoice"
      />

      {/* search, sort and filter component */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
        {/* show all order button */}
        <button
          onClick={() => {
            setOrders(orderList);
            setFilter("default");
            setSearchKeyword("");
            setPriceRange(maxTotalPrice);
            setFilterDate("default");
          }}
          className="min-w-[110px] px-4 py-2 font-bold border bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl rounded w-fit"
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
            <div
              onClick={handleSearch}
              className="cursor-pointer hover:text-yellow-500"
            >
              <FaSearch />
            </div>
          </div>
        </form>

        {/* date filter */}

        <select
          className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="default">All Date</option>
          {orderExistDate &&
            orderExistDate.map((date, index) => (
              <option key={index} value={date}>
                {date.slice(0, 10) ==
                new Date().toLocaleString("en-GB").slice(0, 10)
                  ? "Today"
                  : date}
              </option>
            ))}
        </select>

        {/* filter by category */}
        <select
          className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="default">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="paid">Paid</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* filter by payment method */}
        <select
          className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold"
          value={filterPaymentMethod}
          onChange={(e) => setFilterPaymentMethod(e.target.value)}
        >
          <option value="default">All Payment method</option>
          <option value="cod">COD</option>
          <option value="khqr">KHQR</option>
        </select>
        {/* update record per page */}

        {orderList && orderList.length > 5 && (
          <select
            onChange={(e) => setRecordsPerPage(e.target.value)}
            name="recordsPerPage"
            className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            {orderList.length >= 25 && <option value="25">25 per page</option>}
            {orderList.length >= 50 && <option value="50">50 per page</option>}
            {orderList.length >= 75 && <option value="75">75 per page</option>}
            {orderList.length >= 100 && (
              <option value="100">100 per page</option>
            )}
            <option value={orderList.length}>All per page</option>
          </select>
        )}
      </div>
      <div className="flex gap-2 w-full mb-4">
        {/* price range */}
        <div className="px-4 py-2 ">
          <TotalPriceRangeFilter
            maxTotalPrice={maxTotalPrice}
            minTotalPrice={minTotalPrice}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        <ExportToExcel
          data={dataToExport}
          fileName={`Orders_${new Date().toLocaleDateString()}`}
        />
        <ExportToPDF
          data={dataToExport}
          fileName={`Orders_${new Date().toLocaleDateString()}`}
        />
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
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {/* loading */}
              {orderList && orderList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={12}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}
              {/* not found */}
              {orderList &&
                orderList.length > 0 &&
                orders &&
                orders.length == 0 && (
                  <>
                    <tr className=" text-center">
                      <td
                        className="py-8 dark:text-white font-bold "
                        colSpan={12}
                      >
                        {/* loading */}
                        No result found!
                      </td>
                    </tr>
                  </>
                )}

              {/* display data with pagination */}
              <Pagination
                orders={orders}
                notifyDeleting={notifyDeleting}
                numberOfRecordsPerPage={recordsPerPage}
                handleChangeStatus={handleChangeStatus}
                isStatusUpdated={isStatusUpdated}
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
const TotalPriceRangeFilter = ({
  maxTotalPrice,
  minTotalPrice,
  priceRange,
  setPriceRange,
}) => {
  const handleChange = (event) => {
    setPriceRange(parseInt(event.target.value));
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="flex items-center">
        <label className="mr-2 font-bold whitespace-pre">
          Total Price Range:
        </label>
        <input
          type="range"
          min={minTotalPrice}
          max={maxTotalPrice}
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

TotalPriceRangeFilter.propTypes = {
  maxTotalPrice: PropType.number,
  minTotalPrice: PropType.number,
  priceRange: PropType.number,
  setPriceRange: PropType.func,
};

export default Order;
