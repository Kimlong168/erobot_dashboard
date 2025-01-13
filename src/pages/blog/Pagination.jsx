import { usePagination } from "pagination-react-js";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../contexts/DataContext";
import { Link } from "react-router-dom";
import PopupImage from "../../components/PopupImage";

const Pagination = ({ notifyDeleting, blogs, numberOfRecordsPerPage }) => {
  const { blogCategoryList, authorList } = useContext(DataContext);

  const [showImage, setShowImage] = useState({
    image: null,
    open: false,
  });

  // initialize pagination
  const { records, pageNumbers, setActivePage, setRecordsPerPage } =
    usePagination({
      activePage: 1,
      recordsPerPage: 5,
      totalRecordsLength: blogs.length,
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
      {blogs
        .slice(records.indexOfFirst, records.indexOfLast + 1)
        .map((blog, index) => {
          return (
            <tr
              key={blog.id}
              className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 min-w-[250px]">{blog.title}</td>

              <td className="px-4 py-3">
                {blogCategoryList &&
                blogCategoryList
                  .map((data) =>
                    data.id === blog.categoryId ? data.categoryName : null
                  )
                  .filter((category) => category !== null).length > 0 ? (
                  blogCategoryList.map((data) =>
                    data.id === blog.categoryId ? data.categoryName : null
                  )
                ) : (
                  <p className="truncate">No Category⚠️</p>
                )}
              </td>
              <td className="px-4 py-3">
                {blog.authorId.toLowerCase() === "default"
                  ? "Admin"
                  : authorList &&
                    authorList.map((data) => {
                      if (data.id == blog.authorId) {
                        return data.fullName;
                      }
                    })}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {blog.publicationDate}
              </td>
              <td className="px-4 py-3 text-xs">
                {blog.isActive ? (
                  <span className="p-2 py-0.5 rounded border border-green-600 text-green-600 bg-green-600/10">
                    Active
                  </span>
                ) : (
                  <span className="p-2 py-0.5 rounded border border-red-600 text-red-600 bg-red-600/10">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {blog.coverImage ? (
                  <img
                    className="min-w-[70px] h-[50px] rounded-sm cursor-pointer"
                    src={blog.coverImage}
                    loading="lazy"
                    onClick={() => {
                      setShowImage({
                        image: blog.coverImage,
                        open: true,
                      });
                    }}
                  />
                ) : (
                  "No Image"
                )}

                {showImage.open && showImage.image == blog.coverImage && (
                  <PopupImage
                    image={blog.coverImage}
                    setShowImage={(condition) => {
                      setShowImage({
                        image: blog.coverImage,
                        open: condition,
                      });
                      setShowImage({
                        image: null,
                        open: false,
                      });
                    }}
                  />
                )}
              </td>
              <td className="px-4 py-3 text-sm text-center cursor-pointer">
                <Link to={`/blogDetail/${blog.id}`}>
                  <div className="px-2 py-1.5 rounded bg-yellow-500 text-white cursor-pointer">
                    View
                  </div>
                </Link>
              </td>

              <td className="px-4 py-3 text-sm text-center">
                <Link to={`/updateBlog/${blog.id}`}>
                  <div className="px-2 py-1.5 rounded bg-green-600 text-white">
                    Edit
                  </div>
                </Link>
              </td>

              <td className="px-4 py-3 text-sm text-center cursor-pointer">
                <div
                  onClick={() => notifyDeleting(blog.id, blog.coverImageId)}
                  className="px-2 py-1.5 rounded bg-red-600 text-white"
                >
                  Delete
                </div>
              </td>
            </tr>
          );
        })}
      {/* pagination navigate button */}
      {blogs && blogs.length > 0 && (
        <tr>
          <td
            colSpan={10}
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
  blogs: PropTypes.array.isRequired,
  notifyDeleting: PropTypes.func.isRequired,
  numberOfRecordsPerPage: PropTypes.number.isRequired,
};

export default Pagination;
