import Layout from "../../layouts/Layout";
import { useContext, useEffect, useState } from "react";
import TableHead from "../../components/TableHead";
import { toast } from "react-toastify";
import Toast from "../../utils/Toast";
import { toastProps } from "../../utils/toastProp";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { UpdateContext } from "../../contexts/UpdateContext";
import { deleteObject, ref, listAll } from "firebase/storage";
import { storage } from "../../firebase-config";
import LoadingInTable from "../../components/LoadingInTable";
import { DataContext } from "../../contexts/DataContext";
import { FaSearch } from "react-icons/fa";
import Pagination from "./Pagination";
const Project = () => {
  const { projectList, setShowNotification } = useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);

  const [projects, setProjects] = useState(projectList);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  // search item
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");
    let searchedItem = [];

    searchedItem = projectList.filter(
      (item) =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase().trim()) ||
        item.location.toLowerCase().includes(searchKeyword.toLowerCase().trim())
    );

    setProjects(searchedItem);
    setIsSearched(true);
  };

  //  filter base on category and status
  useEffect(() => {
    let filteredItem = [];
    if (filter === "default") {
      filteredItem = projectList;
    } else if (filter == "previous") {
      filteredItem = projectList.filter((item) => item.status == "previous");
    } else if (filter == "current") {
      filteredItem = projectList.filter((item) => item.status == "current");
    } else {
      filteredItem = projectList.filter((item) => item.status == "upcoming");
    }
    setProjects(filteredItem);
    setIsSearched(false);
    setSearchKeyword("");
  }, [filter, projectList]);

  // delete project notify
  const notifyDeleting = (id, coverImageId, galleryImagesFolderName) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "projects")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(coverImageId);
                  deleteGalleryImagesFromStorage(
                    "projectGalleryImages/" + galleryImagesFolderName
                  );

                  // show deleted success notification
                  setShowNotification({
                    status: true,
                    item: "project",
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

  const deleteImageFromStorage = (coverImageId) => {
    // delete image from firebase storage
    const storageRef = ref(storage, `projectCoverImages/${coverImageId}`);
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

  const deleteGalleryImagesFromStorage = (folderPath) => {
    // Reference to the folder in Firebase Storage
    const folderRef = ref(storage, folderPath);

    // List all files in the folder
    listAll(folderRef)
      .then((result) => {
        const deletePromises = result.items.map((fileRef) =>
          deleteObject(fileRef)
        );

        // Wait for all deletions to complete
        Promise.all(deletePromises)
          .then(() => {
            console.log("All files in the folder deleted successfully");
          })
          .catch((error) => {
            console.error("Error while deleting files: ", error);
          });
      })
      .catch((error) => {
        console.error("Error listing folder contents: ", error);
      });
  };

  if (!projectList) return null;

  return (
    <Layout>
      <TableHead
        color="rgb(59,130,246)"
        title={`Projects (${projectList.length})`}
        border="border-blue-400 text-blue-400"
        link="/createProject"
      />

      {/* search, sort and filter component */}
      <div className="flex flex-col lg:flex-row items-center  gap-6 mb-4">
        {/* show all item button */}
        <button
          onClick={() => {
            setProjects(projectList);
            setFilter("default");
            setSearchKeyword("");
          }}
          className="px-4 py-2 font-bold border bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl rounded w-fit"
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

        {/* filter by status */}
        <select
          className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="default">All Status</option>
          <option value="previous">Previous</option>
          <option value="current">Current</option>
          <option value="upcoming">Upcoming</option>
        </select>

        {/* update record per page */}
        {projectList && projectList.length > 5 && (
          <select
            onChange={(e) => setRecordsPerPage(e.target.value)}
            name="recordsPerPage"
            className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            {projectList.length >= 25 && (
              <option value="25">25 per page</option>
            )}
            {projectList.length >= 50 && (
              <option value="50">50 per page</option>
            )}
            {projectList.length >= 75 && (
              <option value="75">75 per page</option>
            )}
            {projectList.length >= 100 && (
              <option value="100">100 per page</option>
            )}
            <option value={projectList.length}>All per page</option>
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
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {/* loading */}
              {projectList && projectList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={11}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}
              {/* not found */}
              {projectList &&
                projectList.length > 0 &&
                projects &&
                projects.length == 0 && (
                  <>
                    <tr className=" text-center">
                      <td
                        className="py-8 dark:text-white font-bold "
                        colSpan={11}
                      >
                        {/* loading */}
                        No projects found!
                      </td>
                    </tr>
                  </>
                )}

              {/* display data with pagination */}
              <Pagination
                projects={projects}
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

export default Project;
