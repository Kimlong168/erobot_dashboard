import PropTypes from "prop-types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/images/logo.png";
import aba from "../../assets/images/aba-us.jpg";
import { DataContext } from "../../contexts/DataContext";
import { UpdateContext } from "../../contexts/UpdateContext";
import convertToPhoneNumber from "../../utils/convertToPhoneNumber";
import checkSocialMedia from "../../utils/checkSocialMedia";
import getStatusColor from "../../utils/getStatusColor";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaPrint } from "react-icons/fa";
const OrderDetailCard = ({
  id,
  orderId,
  fullName,
  phoneNumber,
  contactLink,
  address,
  email,
  message,
  cartItems,
  total,
  status,
  date,
  // paymentMethod,
  // timeStamp,
}) => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const { contactList } = useContext(DataContext);
  const contact = contactList[0];
  const contentToPrint = useRef(null);
  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  // handle print
  const handlePrint = useReactToPrint({
    documentTitle: orderId,
    onBeforePrint: () => setIsPrint(false),
    onAfterPrint: () => setIsPrint(false),
    removeAfterPrint: true,
  });

  //   update Order
  async function updateOrderStatus(newStatus) {
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
    setIsStatusUpdated(true);
    // update status in this page
    setUpdatedStatus(newStatus);
    console.log("order status updated");
  }

  // This effect will trigger whenever isStatusUpdated changes
  useEffect(() => {
    if (isStatusUpdated) {
      // Reset state after 1 second
      const timeoutId = setTimeout(() => {
        setIsStatusUpdated(false);
      }, 2000);

      // Clear the timeout if the component unmounts or isStatusUpdated changes
      return () => clearTimeout(timeoutId);
    }
  }, [isStatusUpdated]);

  //   handle change status
  const handleChangeStatus = (e) => {
    const newStatus = e.target.value;
    updateOrderStatus(newStatus);

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
  };

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground w-full max-w-3xl mx-auto bg-white shadow-xl overflow-x-auto"
      data-v0-t="card"
    >
      <div ref={contentToPrint} className="min-w-[600px]">
        <div className="p-6 pt-4 grid gap-4">
          <div className={`flex flex-col space-y-1.5 pb-0`}>
            {/* header title */}
            {isPrint ? (
              <>
                <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight mt-2 text-center">
                  Invoice
                </h3>
              </>
            ) : (
              <>
                <h3 className="text-2xl mt-2 font-semibold whitespace-nowrap leading-none tracking-tight">
                  Order ID: {orderId}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Customer information
                </p>
              </>
            )}
          </div>
          <div className="grid grid-cols-2  gap-4 relative">
            <div className="flex flex-col gap-1">
              {/* order date */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Order Date:
              </label>
              <p className="font-medium">{date}</p>
            </div>
            {isPrint ? (
              <div className="flex flex-col gap-1">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Order ID:
                </label>
                <p className="font-medium">{orderId}</p>
              </div>
            ) : (
              <>
                {isStatusUpdated ? (
                  <div>
                    {/* status */}
                    <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                      Status:
                    </label>
                    <div className="rounded flex items-center justify-center w-fit">
                      updating...
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* update status form */}
                    <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                      Status:
                    </label>
                    <select
                      id="status"
                      value={updatedStatus}
                      onChange={(e) => handleChangeStatus(e)}
                      className={`${getStatusColor(
                        updatedStatus
                      )} text-white block cursor-pointer font-bold  px-2 border-2 rounded-md shadow-sm  w-fit focus:outline-none  sm:text-sm`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="paid">Paid</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col gap-1">
              {/* fullname */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Customer:
              </label>
              <p className="font-medium">{fullName}</p>
            </div>
            <div className="flex flex-col gap-1">
              {/* phone number */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Phone Number:
              </label>
              <p className="font-medium  hover:text-blue-600">
                <Link to={`tel:${phoneNumber}`}>
                  {phoneNumber && convertToPhoneNumber(phoneNumber)}
                </Link>
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {/* Email */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Email:
              </label>
              <p className="font-medium  hover:text-blue-600">
                <Link to={`mailto:${email}`}>
                 {email}
                </Link>
              </p>
            </div>
            
            {/* contact link */}
            {!isPrint && (
              <div className="flex flex-col gap-1">
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  {checkSocialMedia(contactLink)}
                </label>
                <p className="font-medium">
                  {contactLink ? (
                    <Link
                      className=" text-blue-500 hover:text-blue-600"
                      to={contactLink}
                    >
                      {contactLink}
                    </Link>
                  ) : (
                    "No link"
                  )}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {/* address */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Address:
              </label>
              <p className="font-medium">{address}</p>
            </div>
            {message && (
              <div className="flex flex-col gap-1">
                {/* message */}
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Customer Remark:
                </label>
                <p className="font-medium">{message}</p>
              </div>
            )}

            {isPrint && (
              <div>
                {/* water mark - sorakhmer logo */}
                <img
                  src={logo}
                  className="w-[260px] opacity-20 absolute  top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid gap-4">
            <div className="overflow-auto border">
              <div className="relative w-full overflow-auto">
                {/* invoice table */}
                <table className="w-full caption-bottom text-sm">
                  {/* table header */}
                  <thead className="[&amp;_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[80px] hidden md:table-cell">
                        Image
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 max-w-[150px]">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        Quantity
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        Price
                      </th>
                    </tr>
                  </thead>

                  {/* table body */}
                  <tbody className="[&amp;_tr:last-child]:border-0">
                    {cartItems &&
                      cartItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          {/* image */}
                          <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                            <img
                              src={item.image}
                              width="64"
                              height="64"
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                            />
                          </td>
                          {/* product name */}
                          <td
                            className={`p-4 ${
                              isPrint && "py-2 text-sm text-gray-800"
                            } align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium`}
                          >
                            {item.name}
                          </td>
                          {/* quantity */}
                          <td
                            className={`p-4 ${
                              isPrint && "py-2 text-sm text-gray-800"
                            } align-middle [&amp;:has([role=checkbox])]:pr-0`}
                          >
                            {item.quantity}
                          </td>
                          {/* price */}
                          <td
                            className={`p-4 ${
                              isPrint && "py-2 text-sm text-gray-800"
                            } align-middle [&amp;:has([role=checkbox])]:pr-0`}
                          >
                            {item.price} $
                          </td>
                        </tr>
                      ))}

                    {/* total price */}
                    <tr>
                      <td className="hidden md:block"></td>
                      <td
                        colSpan={2}
                        className="p-4 align-middle text-right font-bold"
                      >
                        Total
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {total} $
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* payment aba qr */}
            {isPrint && (
              <div
                className={`flex justify-center gap-4  mt-4 z-2 relative ${
                  cartItems.length == 5 && "mt-4"
                }`}
              >
                {/* <div className="flex flex-col justify-center items-center">
                  <img src={logo} className="w-[100px]" alt="" />
                </div> */}

                {/* aba qr code */}
                <img
                  src={aba}
                  alt="qr-code
              "
                  className="w-40 h-40"
                />
                {/* company contact information */}
                <div className="flex flex-col justify-center items-center gap-3 text-sm text-gray-600">
                  <div className="font-bold text-center">SORA KHMER</div>
                  <span>📞 {contact && contact.phoneNumber}</span>{" "}
                  <span>✉️ {contact && contact.email}</span>
                  <span>🌐 www.sorakhmer.com</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 flex items-center justify-between gap-2">
        {/* back button */}
        <Link to="/order">
          <div className="flex items-center gap-2">
            <IoChevronBackOutline className="text-lg" />
            <span className="text-sm">Back</span>
          </div>
        </Link>
        <div>
          {/* buuton printing */}
          <button
            className="flex items-center gap-3 bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600"
            onClick={() => {
              setIsPrint(true);
              setTimeout(() => {
                handlePrint(null, () => contentToPrint.current);
              }, 300);
            }}
          >
            <FaPrint />
            {!isPrint ? "Print/Save" : "Loading..."}
          </button>
        </div>
      </div>
    </div>
  );
};

OrderDetailCard.propTypes = {
  id: PropTypes.id,
  orderId: PropTypes.string,
  fullName: PropTypes.string,
  phoneNumber: PropTypes.string,
  contactLink: PropTypes.string,
  address: PropTypes.string,
  email: PropTypes.string,
  message: PropTypes.string,
  cartItems: PropTypes.array,
  total: PropTypes.number,
  status: PropTypes.string,
  paymentMethod: PropTypes.string,
  date: PropTypes.string,
  timeStamp: PropTypes.string,
};

export default OrderDetailCard;
