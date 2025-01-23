import Layout from "../../layouts/Layout";
import TableHead from "../../components/TableHead";
import { toast } from "react-toastify";
import Toast from "../../utils/Toast";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../../firebase-config";
import { deleteObject, ref } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { UpdateContext } from "../../contexts/UpdateContext";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { toastProps } from "../../utils/toastProp";
import LoadingInTable from "../../components/LoadingInTable";
import { DataContext } from "../../contexts/DataContext";
import { FaSearch } from "react-icons/fa";
import Pagination from "./Pagination";

const Member = () => {
  const { memberList, setShowNotification } = useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);

  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [members, setMembers] = useState(memberList);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  // search member
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");

    const searchedMember = memberList.filter((member) =>
      member.fullName.toLowerCase().includes(searchKeyword.toLowerCase().trim())
    );

    setMembers(searchedMember);
    setIsSearched(true);
  };

  //  filter base on position
  useEffect(() => {
    let filteredMember = [];
    if (filter === "default") {
      filteredMember = memberList;
    } else {
      filteredMember = memberList.filter(
        (member) => member.position.toLowerCase() === filter.toLowerCase()
      );
    }
    setMembers(filteredMember);
    setIsSearched(false);
  }, [filter, memberList]);

  // delete notify
  const notifyDeleting = (id, memberImageId) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "members")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(memberImageId);
                  setShowNotification({
                    status: true,
                    item: "member",
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

  // delete image from firebase storage
  const deleteImageFromStorage = (memberImageId) => {
    // Create a reference to the image you want to delete
    const imageRef = ref(storage, `memberImages/${memberImageId}`);

    // Delete the old image
    deleteObject(imageRef)
      .then(() => {
        console.log("Member Image deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  return (
    <Layout>
      <TableHead
        color="rgb(59,130,246)"
        title={`Member (${memberList.length})`}
        border="border-blue-400 text-blue-400"
        link="/createMember"
      />

      {/* search, sort and filter component */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
        {/* show all member button */}
        <button
          onClick={() => {
            setMembers(memberList);
            setFilter("default");
            setSearchKeyword("");
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
          <option value="default">All Position</option>
          <option value="Member">Member</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Alumni">Alumni</option>
          <option value="Founder">Founder</option>
          <option value="Co-founder">Co-founder</option>
          <option value="Leader">Leader</option>
        </select>

        {/* update record per page */}
        {memberList && memberList.length > 5 && (
          <select
            onChange={(e) => setRecordsPerPage(e.target.value)}
            name="recordsPerPage"
            className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            {memberList.length >= 25 && <option value="25">25 per page</option>}
            {memberList.length >= 50 && <option value="50">50 per page</option>}
            {memberList.length >= 75 && <option value="75">75 per page</option>}
            {memberList.length >= 100 && (
              <option value="100">100 per page</option>
            )}
            <option value={memberList.length}>All per page</option>
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
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Bio</th>
                <th className="px-4 py-3">Profile Image</th>
                <th className="px-4 py-3">Links</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {/* loading */}
              {memberList && memberList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={10}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}
              {/* not found */}
              {memberList &&
                memberList.length > 0 &&
                members &&
                members.length == 0 && (
                  <>
                    <tr className=" text-center">
                      <td
                        className="py-8 dark:text-white font-bold "
                        colSpan={10}
                      >
                        {/* loading */}
                        No members found!
                      </td>
                    </tr>
                  </>
                )}

              {/* display data with pagination */}
              <Pagination
                members={members}
                notifyDeleting={notifyDeleting}
                numberOfRecordsPerPage={recordsPerPage}
              />
            </tbody>
          </table>
        </div>
        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"></div>
      </div>

      {/* Toast alert */}
      <Toast />
    </Layout>
  );
};

export default Member;
