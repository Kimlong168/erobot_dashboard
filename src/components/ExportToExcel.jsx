import { utils, writeFile } from "xlsx";
import PropTypes from "prop-types";
import { PiDownloadBold } from "react-icons/pi";
const ExportToExcel = ({ data, fileName }) => {
  const handleExport = () => {
    const worksheet = utils.json_to_sheet(data); // Convert JSON data to a sheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Add sheet to workbook

    writeFile(workbook, `${fileName}.xlsx`); // Save the workbook as Excel file
  };

  return (
    <button
      className="w-fit border text-white bg-green-600 border-gray-300 focus:border-green-500 focus:outline-green-500  rounded-md p-2 flex gap-2 items-center"
      onClick={handleExport}
    >
      Excel
      <PiDownloadBold  />
    </button>
  );
};

ExportToExcel.propTypes = {
  data: PropTypes.array.isRequired,
  fileName: PropTypes.string.isRequired,
};
export default ExportToExcel;
