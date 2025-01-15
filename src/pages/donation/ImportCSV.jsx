import { useContext, useState } from "react";
import Papa from "papaparse";
import { db } from "../../firebase-config"; // Import Firestore
import { collection, addDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { UpdateContext } from "../../contexts/UpdateContext";
import { DataContext } from "../../contexts/DataContext";
import { useNavigate } from "react-router-dom";
import PreviewDonors from "./PreviewDonors";
const ImportCSV = ({ data, setData }) => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewAs, setPreviewAs] = useState("table");
  const [message, setMessage] = useState({
    message: "",
    color: "",
  });

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Parse as JSON (object) instead of arrays
        skipEmptyLines: true, // Skip empty lines
        complete: (result) => {
          setData(result.data); // Update state with parsed data
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  // Store data in Firestore
  const handleStoreData = async () => {
    if (data.length === 0) {
      setMessage({
        message: "No data to store in Firestore.",
        color: "red",
      });
      return;
    }
    setLoading(true);
    const collectionRef = collection(db, "donors"); // Replace with your collection name
    try {
      for (const item of data) {
        await addDoc(collectionRef, item); // Insert each item into Firestore
      }
      setMessage({
        message: "Data stored successfully.",
        color: "green",
      });
    } catch (error) {
      console.error("Error storing data:", error);
      setMessage({
        message: "Error storing data in Firestore.",
        color: "red",
      });
    } finally {
      navigate("/donor");
      setLoading(false);
      setData([]); // Clear data after storing
      setIsUpdated((prev) => !prev); // Update context to refresh data
      setShowNotification({
        status: true,
        item: "donor",
        action: "created",
      });
    }
  };

  const removeDonor = (id) => {
    const newData = data.filter(
      (item) => id !== item.name + item.amount + item.date + item.source
    );
    console.log(newData);
    setData(newData);
  };

  return (
    <>
      <fieldset className="border border-blue-400 p-4 rounded-md shadow-md my-10 ">
        <legend className="text-xl uppercase font-bold text-blue-400">
          Create Donors (Import CSV)
        </legend>

        <input
          className="border border-gray-300 p-2 rounded w-full outline-none mb-5"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
        <button
          className="bg-gray-700 text-white font-bold p-2 rounded "
          onClick={handleStoreData}
          // disabled={loading || data.length === 0}
        >
          {loading
            ? "Creating..."
            : `Create ${data.length > 0 ? data.length : ""} donors`}
        </button>
        {message.message && (
          <p
            className={`mt-3 text-sm p-2 rounded border ${
              message.color == "red"
                ? "bg-red-400/30  border-red-600 text-red-600"
                : "bg-green-500/30  border-green-700 text-green-700"
            }`}
          >
            {message.message}
          </p>
        )}
      </fieldset>
      {data.length > 0 && (
        <div className="flex items-center gap-3 my-5">
          <h2 className="mt-3">Data Preview:</h2>
          <div>
            <select
              className="border border-gray-300 p-2 rounded w-full outline-none"
              id="previewAs"
              value={previewAs}
              onChange={(e) => setPreviewAs(e.target.value)}
            >
              <option value="table">Table</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
      )}
      {previewAs === "table" && data.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full rounded-lg overflow-hidden">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Remove</th>
              </tr>
            </thead>
            <PreviewDonors
              donors={data}
              remove={removeDonor}
              numberOfRecordsPerPage={5}
            />
          </table>
        </div>
      ) : (
        <>
          {data.length > 0 && (
            <>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </>
          )}
        </>
      )}
    </>
  );
};
ImportCSV.propTypes = {
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
};
export default ImportCSV;
