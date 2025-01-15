import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
import getCurrentDate from "../../utils/getCurrentDate";
const CreateDonor = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [donor, setDonor] = useState({
    name: "",
    amount: "",
    source: "socialMedia",
    date: getCurrentDate(),
  });

  // handle onChange event for input
  const handleOnChange = (e) => {
    setDonor({
      ...donor,
      [e.target.name]: e.target.value,
    });
  };
  let navigate = useNavigate();
  const postCollectionRef = collection(db, "donors");

  const createdonor = () => {
    if (donor.amount === "") {
      notify("Please fill all the required fields");

      return;
    }
    // add donor to firestore
    addDoc(postCollectionRef, {
      name: donor.name ? donor.name : "Anonymous",
      amount: donor.amount,
      source: donor.source,
      date: donor.date,
    });
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "donor",
      action: "created",
    });
    // navigate to donor page
    navigate("/donor");
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-blue-400 underline uppercase">
          Create donor
        </div>
        <br />

        {/* create donor categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* fullname input */}
            <label className="font-bold text-xl">Name</label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="name"
              value={donor.name}
              onChange={(e) => handleOnChange(e)}
            />

            {/* amount input */}
            <label className="font-bold text-xl">
              Amount ($) <RedStar />
            </label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="number"
              name="amount"
              placeholder="example: 1000"
              value={donor.amount}
              onChange={(e) => handleOnChange(e)}
            />

            {/* source input */}
            <label className="font-bold text-xl">Source</label>
            <select
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              name="source"
              value={donor.source}
              onChange={(e) => handleOnChange(e)}
            >
              <option value="">Select source</option>
              <option value="website">Website</option>
              <option value="socialMedia">Social Media</option>
              <option value="other">Other</option>
            </select>

            {/* date input */}
            <label className="font-bold text-xl">Date</label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="date"
              name="date"
              value={donor.date}
              onChange={(e) => handleOnChange(e)}
            />

            {/* create donor button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                donor.fullName !== "" && donor.profilePicture !== null
                  ? createdonor
                  : notify
              }
            >
              Create donor
            </button>

            {/* toast alert */}
            <Toast />

            {/* button back */}
            <ButtonBack link="/donor" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateDonor;
