import PropTypes from "prop-types";
const DeletingAlertBox = ({ deleteItemFucntion, setIsUpdated }) => {
  return (
    <div className="flex items-center gap-3">
      <small className="text-xs uppercase">Are you sure to delete?</small>
      <button
        className="hover:border text-xs text-white bg-red-600 hover:bg-transparent hover:text-red-600 hover:font-bold hover:border-red-600 px-1.5 py-1 rounded"
        onClick={() => {
          // call delete function
          deleteItemFucntion();
          // to update data in the table
          setIsUpdated((prev) => !prev);
        }}
      >
        Delete
      </button>
    </div>
  );
};
DeletingAlertBox.propTypes = {
  deleteItemFucntion: PropTypes.func.isRequired,
  setIsUpdated: PropTypes.func.isRequired,
};
export default DeletingAlertBox;
