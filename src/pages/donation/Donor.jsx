import Layout from "../../layouts/Layout";
import { useContext, useEffect, useState } from "react";
import TableHead from "../../components/TableHead";
import { toast } from "react-toastify";
import Toast from "../../utils/Toast";
import { toastProps } from "../../utils/toastProp";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { UpdateContext } from "../../contexts/UpdateContext";
import LoadingInTable from "../../components/LoadingInTable";
import { DataContext } from "../../contexts/DataContext";
import { FaSearch } from "react-icons/fa";
import Pagination from "./Pagination";
import ExportToExcel from "../../components/ExportToExcel";
import ExportToPDF from "../../components/ExportToPDF";

const Donor = () => {
  const { donorList, setShowNotification } = useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);

  const [donors, setDonors] = useState(donorList);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");
    let searchedDonor = [];

    searchedDonor = donorList.filter((item) =>
      item.name.toLowerCase().includes(searchKeyword.toLowerCase().trim())
    );

    setDonors(searchedDonor);
    setIsSearched(true);
  };

  //  filter base source
  useEffect(() => {
    let filteredItem = [];
    if (filter === "default") {
      filteredItem = donorList;
    } else if (filter == "website") {
      filteredItem = donorList.filter((donor) => donor.source === "website");
    } else if (filter == "socialMedia") {
      filteredItem = donorList.filter(
        (donor) => donor.source === "socialMedia"
      );
    } else {
      filteredItem = donorList.filter((donor) => donor.source === "other");
    }
    setDonors(filteredItem);
    setIsSearched(false);
    setSearchKeyword("");
  }, [filter, donorList]);

  // delete donor notify
  const notifyDeleting = (id) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "donors")
              .then((result) => {
                // call delete image function
                if (result) {
                  // show deleted success notification
                  setShowNotification({
                    status: true,
                    item: "donor",
                    action: "deleted",
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

  const dataToExport = donors.map((donor, index) => {
    return {
      No: index + 1,
      Name: donor.name,
      Amount: donor.amount,
      Date: donor.date,
      Source: donor.source,
    };
  });

  return (
    <Layout>
      <TableHead
        color="rgb(124,58,237)"
        title={`Donor (${donorList.length})`}
        border="border-violet-600 text-violet-600"
        link="/createDonor"
      />
      {/* search, sort and filter component */}
      <div className="flex flex-col lg:flex-row items-center gap-6 mb-4">
        {/* show all donor button */}
        <button
          onClick={() => {
            setDonors(donorList);
            setFilter("default");
            setSearchKeyword("");
          }}
          className="min-w-[105px] w-fit px-4 py-2 font-bold border bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl rounded"
        >
          Show all
        </button>
        {/* search bar */}
        <form className="w-full lg:w-auto " onSubmit={handleSearch}>
          <div className="flex  items-center gap-3 px-4 py-1.5 border ">
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
          className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="default">All Sources</option>
          <option value="website">Website</option>
          <option value="socialMedia">Social Media</option>
          <option value="other">Other</option>
        </select>

        {/* update record per page */}
        {donorList && donorList.length > 5 && (
          <select
            onChange={(e) => setRecordsPerPage(e.target.value)}
            name="recordsPerPage"
            className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            {donorList.length >= 25 && <option value="25">25 per page</option>}
            {donorList.length >= 50 && <option value="50">50 per page</option>}
            {donorList.length >= 75 && <option value="75">75 per page</option>}
            {donorList.length >= 100 && (
              <option value="100">100 per page</option>
            )}
            <option value={donorList.length}>All per page</option>
          </select>
        )}

        <div className="flex gap-2 w-full">
          <ExportToExcel
            data={dataToExport}
            fileName={`Donors_${new Date().toLocaleDateString()}`}
          />
          <ExportToPDF
            data={dataToExport}
            fileName={`Donors_${new Date().toLocaleDateString()}`}
          />
        </div>
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
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {/* loading */}
              {donorList && donorList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={10}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}
              {/* not found */}
              {donorList &&
                donorList.length > 0 &&
                donors &&
                donors.length == 0 && (
                  <>
                    <tr className=" text-center">
                      <td
                        className="py-8 dark:text-white font-bold "
                        colSpan={10}
                      >
                        {/* loading */}
                        No donors found!
                      </td>
                    </tr>
                  </>
                )}

              {/* display data with pagination */}
              <Pagination
                donors={donors}
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

export default Donor;
