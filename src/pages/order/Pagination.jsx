import { usePagination } from "pagination-react-js";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import checkSocialMedia from "../../utils/checkSocialMedia";
import getStatusColor from "../../utils/getStatusColor";

const Pagination = ({
  notifyDeleting,
  orders,
  numberOfRecordsPerPage,
  isStatusUpdated,
  handleChangeStatus,
}) => {
  // initialize pagination
  const { records, pageNumbers, setActivePage, setRecordsPerPage } =
    usePagination({
      activePage: 1,
      recordsPerPage: 5,
      totalRecordsLength: orders.length,
      offset: 2,
      navCustomPageSteps: { prev: 3, next: 3 },
      permanentFirstNumber: true,
      permanentLastNumber: true,
    });

  // update active page
  function updateActivePage(pageNumber) {
    pageNumber && setActivePage(pageNumber);
  }

  // update records per page
  useEffect(() => {
    setRecordsPerPage(numberOfRecordsPerPage);
    setActivePage(1);
  }, [numberOfRecordsPerPage]);

  return (
    <>
      {/* blogs list */}
      {orders
        .slice(records.indexOfFirst, records.indexOfLast + 1)
        .map((item, index) => {
          return (
            <tr
              key={item.id}
              className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{item.orderId}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.fullName}</td>
              <td className="px-4 py-3">{item.address}</td>
              <td className="px-4 py-3">
                <Link to={`tel:${item.phoneNumber}`}>{item.phoneNumber}</Link>
              </td>
              <td className="px-4 py-3">
                {item.contactLink ? (
                  <Link
                    to={item.contactLink}
                    className="text-blue-600 hover:underline"
                  >
                    {checkSocialMedia(item.contactLink)}
                  </Link>
                ) : (
                  "No link"
                )}
              </td>
              <td className="px-4 py-3">
                <span className="uppercase"> {item?.paymentMethod} </span>
                {item?.paymentMethod == "khqr" ? `(${item?.md5})` : ""}
              </td>
              <td className="px-4 py-3">{item.date}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.total} $</td>
              <td className="px-4 py-3">
                {isStatusUpdated.status && isStatusUpdated.id === item.id ? (
                  <div className="px-2 py-1.5 rounded  dark:text-white flex items-center justify-center">
                    updating...
                  </div>
                ) : (
                  <select
                    id="status"
                    value={item.status}
                    onChange={(e) => handleChangeStatus(e, item.id)}
                    className={`${getStatusColor(
                      item.status
                    )} text-white block cursor-pointer font-bold py-1 px-2 border-2 rounded-md shadow-sm   focus:outline-none  sm:text-sm`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
              </td>

              {/* view button */}
              <td className="px-4 py-3 text-sm text-center">
                <Link to={`/orderDetail/${item.orderId}`}>
                  <div className="px-2 py-1.5 rounded bg-yellow-500 text-white">
                    view
                  </div>
                </Link>
              </td>

              {/* delete button */}
              <td className="px-4 py-3 text-sm text-center cursor-pointer">
                <div
                  onClick={() => notifyDeleting(item.id)}
                  className="px-2 py-1.5 rounded bg-red-600 text-white"
                >
                  Delete
                </div>
              </td>
            </tr>
          );
        })}
      {/* pagination navigate button */}
      {orders && orders.length > 0 && (
        <tr>
          <td
            colSpan={12}
            role="navigation"
            aria-label="Pagination Navigation"
            className="bg-gray-900  text-blue-500 "
          >
            <ul className="flex justify-center items-center  gap-3 w-auto list-none border border-gray-500 py-2 px-2 rounded user-select-none">
              <PaginationItem
                label={`Goto first page ${pageNumbers.firstPage}`}
                rel="first"
                onClick={() => updateActivePage(pageNumbers.firstPage)}
              >
                &laquo;
              </PaginationItem>

              <PaginationItem
                label={`Goto previous page ${pageNumbers.previousPage}`}
                rel="prev"
                onClick={() => updateActivePage(pageNumbers.previousPage)}
              >
                &lsaquo;
              </PaginationItem>

              <PaginationItem
                label={`Goto first page ${pageNumbers.firstPage}`}
                active={pageNumbers.firstPage === pageNumbers.activePage}
                onClick={() => updateActivePage(pageNumbers.firstPage)}
              >
                {pageNumbers.firstPage}
              </PaginationItem>

              {pageNumbers.customPreviousPage && (
                <PaginationItem
                  label={`Goto page ${pageNumbers.customPreviousPage}`}
                  onClick={() =>
                    updateActivePage(pageNumbers.customPreviousPage)
                  }
                >
                  &middot;&middot;&middot;
                </PaginationItem>
              )}

              {pageNumbers.navigation.map((navigationNumber) => {
                const isFirstOrLastPage =
                  navigationNumber === pageNumbers.firstPage ||
                  navigationNumber === pageNumbers.lastPage;

                return isFirstOrLastPage ? null : (
                  <PaginationItem
                    label={`Goto page ${navigationNumber}`}
                    key={navigationNumber}
                    active={navigationNumber === pageNumbers.activePage}
                    onClick={() => updateActivePage(navigationNumber)}
                  >
                    {navigationNumber}
                  </PaginationItem>
                );
              })}

              {pageNumbers.customNextPage && (
                <PaginationItem
                  label={`Goto page ${pageNumbers.customNextPage}`}
                  onClick={() => updateActivePage(pageNumbers.customNextPage)}
                >
                  &middot;&middot;&middot;
                </PaginationItem>
              )}

              {pageNumbers.firstPage !== pageNumbers.lastPage && (
                <PaginationItem
                  label={`Goto last page ${pageNumbers.lastPage}`}
                  active={pageNumbers.lastPage === pageNumbers.activePage}
                  onClick={() => updateActivePage(pageNumbers.lastPage)}
                >
                  {pageNumbers.lastPage}
                </PaginationItem>
              )}

              <PaginationItem
                label={`Goto next page ${pageNumbers.nextPage}`}
                rel="next"
                onClick={() => updateActivePage(pageNumbers.nextPage)}
              >
                &rsaquo;
              </PaginationItem>

              <PaginationItem
                label={`Goto last page ${pageNumbers.lastPage}`}
                rel="last"
                onClick={() => updateActivePage(pageNumbers.lastPage)}
              >
                &raquo;
              </PaginationItem>
            </ul>
          </td>
        </tr>
      )}
    </>
  );
};

const PaginationItem = ({ children, label, active, onClick, rel }) => {
  return (
    <li
      className={[
        "w-[30px] h-[30px] flex items-center justify-center rounded hover:bg-gray-200 transition-colors duration-100 cursor-pointer",
        active
          ? "text-white bg-active pointer-events-none transition-colors duration-100"
          : undefined,
      ]
        .filter((value) => value)
        .join(" ")}
      aria-current={active ?? "page"}
      aria-label={label}
      rel={rel}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

PaginationItem.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  rel: PropTypes.string,
};

Pagination.propTypes = {
  orders: PropTypes.array.isRequired,
  notifyDeleting: PropTypes.func.isRequired,
  numberOfRecordsPerPage: PropTypes.number.isRequired,
  isStatusUpdated: PropTypes.object.isRequired,
  handleChangeStatus: PropTypes.func.isRequired,
};

export default Pagination;
