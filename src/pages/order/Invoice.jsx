// invoice component
import PropTypes from "prop-types";
import { useContext } from "react";
import { DataContext } from "../../contexts/DataContext";
import convertToPhoneNumber from "../../utils/convertToPhoneNumber";
import logo from "../../assets/images/logo.png";
// import aba from "../../assets/images/aba-us.png";
import { Link } from "react-router-dom";
// import axios from "axios";

const Invoice = ({
  orderId,
  customer,
  phoneNumber,
  address,
  date,
  remark,
  orderItems,
  totalPrice,
  qrCode,
  deepLink,
}) => {
  const { contactList } = useContext(DataContext);
  const contact = contactList[0];
  console.log(qrCode, deepLink);
  return (
    <div
      className="min-h-[794px] w-[558px] max-w-3xl mx-auto bg-white"
      data-v0-t="card"
    >
      <div className="w-full">
        <div className="p-6 pt-4 grid gap-4">
          <div className={`flex flex-col space-y-1.5 pb-0`}>
            <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight mt-2 text-center">
              Invoice
            </h3>
          </div>
          <div className="grid grid-cols-2  gap-4 relative">
            <div className="flex flex-col gap-1">
              {/* order date */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Order Date:
              </label>
              <p className="font-medium">{formatDate(date)}</p>
            </div>

            {/* order id */}
            <div className="flex flex-col gap-1">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Order ID:
              </label>
              <p className="font-medium">{orderId}</p>
            </div>

            <div className="flex flex-col gap-1">
              {/* fullname */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Customer:
              </label>
              <p className="font-medium">{customer}</p>
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
              {/* address */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Address:
              </label>
              <p className="font-medium">{address}</p>
            </div>
            {remark && (
              <div className="flex flex-col gap-1">
                {/* message */}
                <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                  Remark
                </label>
                <p className="font-medium">{remark}</p>
              </div>
            )}

            <div>
              {/* water mark - sorakhmer logo */}
              <img
                src={logo}
                className="w-[260px] opacity-20 absolute  top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
                alt=""
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="overflow-auto border">
              <div className="relative w-full overflow-auto">
                {/* invoice table */}
                <table className="w-full caption-bottom text-sm">
                  {/* table header */}
                  <thead className="[&amp;_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
                    {orderItems &&
                      orderItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          {/* product name */}
                          <td
                            className="p-4  py-2 text-sm text-gray-800
                              align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                          >
                            {item.name}
                          </td>
                          {/* quantity */}
                          <td
                            className="p-4 py-2 text-sm text-gray-800
                               align-middle [&amp;:has([role=checkbox])]:pr-0"
                          >
                            {item.quantity}
                          </td>
                          {/* price */}
                          <td
                            className="p-4  py-2 text-sm text-gray-800
                               align-middle [&amp;:has([role=checkbox])]:pr-0"
                          >
                            {item.price} $
                          </td>
                        </tr>
                      ))}

                    {/* total price */}
                    <tr>
                      <td
                        colSpan={2}
                        className="p-4 align-middle text-right font-bold"
                      >
                        Total
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {totalPrice} $
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* payment aba qr */}

            <div
              className={`flex justify-center gap-4  mt-4 z-2 relative ${
                orderItems.length == 5 && "mt-4"
              }`}
            >
              {/* <div className="flex flex-col justify-center items-center">
                    <img src={logo} className="w-[100px]" alt="" />
                  </div> */}

              {/* aba qr code */}
              {/* <div>
                <img
                  src={qrCode}
                  alt="qr-code
                "
                  className="w-40 h-40"
                />
                {deepLink && (
                  <Link
                    to={deepLink}
                    className="text-blue-400 hover:text-blue-600 hover:underline"
                  >
                    Click here to pay in Bakong Mobile App
                  </Link>
                )}
              </div> */}
              {/* company contact information */}
              <div className="flex flex-col justify-center items-center gap-3 text-sm text-gray-600">
                <div className="font-bold text-center">ERobot - Thank You!</div>
                <span>📞 {contact && contact.phoneNumber}</span>{" "}
                <span>✉️ {contact && contact.email}</span>
                <span>🌐 www.erobotcambodia.org</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatDate(inputDate) {
  const dateParts = inputDate.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  // Construct the new format
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}

Invoice.propTypes = {
  orderId: PropTypes.string,
  customer: PropTypes.string,
  phoneNumber: PropTypes.string,
  address: PropTypes.string,
  date: PropTypes.string,
  totalPrice: PropTypes.number,
  remark: PropTypes.string,
  orderItems: PropTypes.array,
  deepLink: PropTypes.string,
  qrCode: PropTypes.string,
};

export default Invoice;
