import { useContext, useEffect, useState } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layouts/Layout";
import Loading from "../../components/Loading";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const UpdateDonor = () => {
  const { id: donorParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [donor, setDonor] = useState({
    name: null,
    amount: "",
    date: "",
    source: "",
  });
  let navigate = useNavigate();

  // handle onChange event for input
  const handleOnChange = (e) => {
    setDonor({
      ...donor,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "donors", donorParams);

    // fetch a field of data from firebase by donorParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          setDonor({
            name: data.name,
            amount: data.amount,
            date: data.date,
            source: data.source,
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [donorParams]);

  //   update product if all required fields are filled
  async function updateDonor() {
    // navigate to product page in advance
    navigate("/donor");
    const docRef = doc(db, "donors", donorParams);
    await setDoc(
      docRef,
      {
        name: donor.name,
        amount: donor.amount,
        date: donor.date,
        source: donor.source,
      },
      { merge: true }
    );

    // to update the data in the table
    setIsUpdated((prev) => !prev);

    setShowNotification({
      status: true,
      item: "donor",
      action: "updated",
    });

    console.log("donor updated");
  }

  // loading until data is fetched
  if (donor.name === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 mt-6 rounded">
        {/* title */}
        <div className="text-center p-4 font-bold text-3xl text-blue-400 underline uppercase">
          Update donor
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
            <label className="font-bold text-xl">
              Date <RedStar />
            </label>
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
              onClick={donor.amount && donor.date ? updateDonor : notify}
            >
              Update donor
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

export default UpdateDonor;
