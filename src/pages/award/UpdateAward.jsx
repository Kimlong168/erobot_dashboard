import { useContext, useEffect, useState } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Layout from "../../layouts/Layout";
import Loading from "../../components/Loading";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import formatDate from "../../utils/fomatDate";
import convertDateFormat from "../../utils/convertDate";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const UpdateAward = () => {
  const { id: awardParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [award, setAward] = useState({
    awardName: null,
    awardLogo: "",
    awardLogoId: "",
    description: "",
    recieveDate: "",
    awardedBy: "",
  });

  let navigate = useNavigate();

  // handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "awardLogo") {
      setAward({
        ...award,
        [e.target.name]: e.target.files[0],
      });

      return;
    }

    setAward({
      ...award,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "awards", awardParams);

    // fetch a field of data from firebase by awardParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          setAward({
            awardName: data.awardName,
            description: data.description,
            recieveDate: convertDateFormat(data.recieveDate),
            awardedBy: data.awardedBy,
            awardLogoId: data.awardLogoId,
            awardLogo: null,
          });

          // get old image url
          setOldImageUrl(data.awardLogo);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [awardParams]);

  //   update product if all required fields are filled
  async function updateAward() {
    // navigate to product page in advance
    navigate("/award");
    // if image is not updated
    if (award.awardLogo === null) {
      const docRef = doc(db, "awards", awardParams);
      await setDoc(
        docRef,
        {
          awardName: award.awardName,
          description: award.description,
          recieveDate: formatDate(award.recieveDate),
          awardedBy: award.awardedBy,
          awardLogoId: award.awardLogoId,
          awardLogo: oldImageUrl,
        },
        { merge: true }
      );
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `awardImages/${award.awardLogoId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log(award.awardName, "award logo image deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `awardImages/${award.awardLogoId}`);
      uploadBytes(imageRef, award.awardLogo).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);

            // update data in the firestore with a new image url and new data
            updateAwardAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new award logo image uploaded");
      });
    }

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    // show update success notification
    setShowNotification({
      status: true,
      item: "award",
      action: "updated",
    });

    console.log("award updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateAuthor function because we need to get the new image url first
  async function updateAwardAndNewImage(newImageUrl) {
    const docRef = doc(db, "awards", awardParams);
    await setDoc(
      docRef,
      {
        awardName: award.awardName,
        description: award.description,
        recieveDate: formatDate(award.recieveDate),
        awardedBy: award.awardedBy,
        awardLogoId: award.awardLogoId,
        awardLogo: newImageUrl,
      },
      { merge: true }
    );
  }

  // loading until data is fetched
  if (award.awardName === null) {
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
        <div className="text-center p-4 font-bold text-3xl text-purple-500 underline uppercase">
          Update Company Award
        </div>
        <br />

        {/* update award categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* award name input */}
            <label className="font-bold text-xl">
              Award Name
              <RedStar />
            </label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="awardName"
              value={award.awardName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* Logo picture input */}
            <label className="font-bold text-xl">Award Picture</label>
            <input
              className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
              type="file"
              name="awardLogo"
              onChange={(e) => handleOnChange(e)}
            />

            {/* awardedBy input */}
            <label className="font-bold text-xl">Awarded By:</label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              placeholder="(optional)"
              type="text"
              name="awardedBy"
              value={award.awardedBy}
              onChange={(e) => handleOnChange(e)}
            />

            {/* recieve date */}
            <div className="w-full">
              <label className="font-bold text-xl ">Recieve Date</label>
              <input
                placeholder="(optional)"
                type="date"
                name="recieveDate"
                className="border border-gray-700  uppercase p-2 rounded w-full outline-none mb-5 cursor-pointer block"
                value={award.recieveDate}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            {/* description input */}
            <label className="font-bold text-xl">Description:</label>
            <textarea
              placeholder="(optional)"
              rows={3}
              value={award.description}
              name="description"
              onChange={(e) => handleOnChange(e)}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            />

            {/* create partner button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={award.awardName ? updateAward : notify}
            >
              Update Award
            </button>

            {/* toast alert */}
            <Toast />

            {/* button back */}
            <ButtonBack link="/award" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateAward;
