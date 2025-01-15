import jsPDF from "jspdf";
import "jspdf-autotable";
import { PiDownloadBold } from "react-icons/pi";
import PropTypes from "prop-types";
const ExportToPDF = ({ data, fileName }) => {
  const handleExport = () => {
    // const doc = new jsPDF(); //
    const doc = new jsPDF({ orientation: "landscape" });

    // Generate table data
    const tableColumn = Object.keys(data[0]); // Headers (keys of objects)
    const tableRows = data.map((item) => Object.values(item)); // Data (values of objects)

    // Add title
    doc.text(fileName, 14, 15);

    // Create table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save PDF
    doc.save(`${fileName}.pdf`);
  };

  return (
    <button
      className="w-fit border text-white bg-green-600 border-gray-300 focus:border-green-500 focus:outline-green-500  rounded-md p-2 flex gap-2 items-center"
      onClick={handleExport}
    >
      PDF
      <PiDownloadBold />
    </button>
  );
};

ExportToPDF.propTypes = {
  data: PropTypes.array.isRequired,
  fileName: PropTypes.string.isRequired,
};

export default ExportToPDF;
