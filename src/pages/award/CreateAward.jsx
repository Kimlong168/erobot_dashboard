import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Layout from "../../layouts/Layout";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import formatDate from "../../utils/fomatDate";
import notify from "../../utils/Notify";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const CreateAward = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const {setShowNotification} = useContext(DataContext);
  const [award, setAward] = useState({
    awardName: null,
    awardLogo: "",
    awardLogoId: "",
    description: "",
    recieveDate: "",
    awardedBy: "",
  });

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

  const uploadImageAndCreateAward = () => {
    // navigate to the author page
    navigate(`/award`);

    const fullNameNoSpaces = award.awardName.replace(/\s+/g, "");
    const timestamp = new Date().getTime();

    // Concatenate full name and timestamp to create the ID
    const imageId = `${fullNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `awardImages/${imageId}`);
    uploadBytes(imageRef, award.awardLogo).then(() => {
      // Get the download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("award logo URL:", downloadURL);
          //store author and image to firestore
          createAward(imageId, downloadURL);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
      console.log("award logo image uploaded");
    });
  };

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "awards");

  const createAward = (imageId, downloadURL) => {
    // add author to firestore
    addDoc(postCollectionRef, {
      awardName: award.awardName,
      awardLogoId: imageId,
      awardLogo: downloadURL,
      description: award.description,
      recieveDate: formatDate(award.recieveDate),
      awardedBy: award.awardedBy,
    });
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "award",
      action: "created",
    });
    console.log("company award added", award.awardName);
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-purple-400 underline uppercase">
          Create Company Award
        </div>
        <br />

        {/* create award form */}
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
            <label className="font-bold text-xl">
              Award Picture
              <RedStar />
            </label>
            <input
              className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
              type="file"
              name="awardLogo"
              onChange={(e) => handleOnChange(e)}
            />

            {/* awardedBy input */}
            <label className="font-bold text-xl">Awarded By</label>
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
            <label className="font-bold text-xl">Description</label>
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
              onClick={
                award.awardName && award.awardLogo
                  ? uploadImageAndCreateAward
                  : notify
              }
            >
              Create Award
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

export default CreateAward;
