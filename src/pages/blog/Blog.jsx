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
import Pagination from "./Pagination";
const Blog = () => {
  const { blogList, blogCategoryList, setShowNotification } =
    useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);

  const [blogs, setBlogs] = useState(blogList);
  const [filter, setFilter] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  // search blog
  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("default");
    let searchedBlog = [];

    searchedBlog = blogList.filter((blog) =>
      blog.title.toLowerCase().includes(searchKeyword.toLowerCase().trim())
    );

    setBlogs(searchedBlog);
    setIsSearched(true);
  };

  //  filter base on category and status
  useEffect(() => {
    let filteredBlog = [];
    if (filter === "default") {
      filteredBlog = blogList;
    } else if (filter == "active") {
      filteredBlog = blogList.filter((blog) => blog.isActive);
    } else if (filter == "inactive") {
      filteredBlog = blogList.filter((blog) => !blog.isActive);
    } else {
      filteredBlog = blogList.filter((blog) => blog.categoryId === filter);
    }
    setBlogs(filteredBlog);
    setIsSearched(false);
    setSearchKeyword("");
  }, [filter, blogList]);

  // delete Blog notify
  const notifyDeleting = (id, coverImageId) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "blogs")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(coverImageId);

                  // show deleted success notification
                  setShowNotification({
                    status: true,
                    item: "blog",
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
    const storageRef = ref(storage, `blogCoverImages/${coverImageId}`);
    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        console.log("blog cover image deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  return (
    <Layout>
      <TableHead
        color="rgb(124,58,237)"
        title={`Articles (${blogList.length})`}
        border="border-violet-600 text-violet-600"
        link="/createBlog"
      />
      {/* search, sort and filter component */}
      <div className="flex flex-col lg:flex-row items-center  gap-6 mb-4">
        {/* show all blog button */}
        <button
          onClick={() => {
            setBlogs(blogList);
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

        {/* filter by category */}
        <select
          className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="default">All Categories</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          {blogCategoryList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>

        {/* update record per page */}
        {blogList && blogList.length > 5 && (
          <select
            onChange={(e) => setRecordsPerPage(e.target.value)}
            name="recordsPerPage"
            className="outline-none p-2 px-3 cursor-pointer border bg-transparent font-bold w-full lg:w-auto"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            {blogList.length >= 25 && <option value="25">25 per page</option>}
            {blogList.length >= 50 && <option value="50">50 per page</option>}
            {blogList.length >= 75 && <option value="75">75 per page</option>}
            {blogList.length >= 100 && (
              <option value="100">100 per page</option>
            )}
            <option value={blogList.length}>All per page</option>
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
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {/* loading */}
              {blogList && blogList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 text-white font-bold " colSpan={10}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}
              {/* not found */}
              {blogList &&
                blogList.length > 0 &&
                blogs &&
                blogs.length == 0 && (
                  <>
                    <tr className=" text-center">
                      <td
                        className="py-8 dark:text-white font-bold "
                        colSpan={10}
                      >
                        {/* loading */}
                        No blogs found!
                      </td>
                    </tr>
                  </>
                )}

              {/* display data with pagination */}
              <Pagination
                blogs={blogs}
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

export default Blog;


