import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Layout from "../../layouts/Layout";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const CreatePartner = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [partner, setPartner] = useState({
    partnerName: null,
    partnerLogo: "",
    description: "",
    link: "",
  });

  // handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "partnerLogo") {
      setPartner({
        ...partner,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setPartner({
      ...partner,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImageAndCreatePartner = () => {
    // navigate to the author page
    navigate(`/partner`);

    const fullNameNoSpaces = partner.partnerName.replace(/\s+/g, "");
    const timestamp = new Date().getTime();

    // Concatenate full name and timestamp to create the ID
    const imageId = `${fullNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `partnerImages/${imageId}`);
    uploadBytes(imageRef, partner.partnerLogo).then(() => {
      // Get the download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("partner logo URL:", downloadURL);
          //store author and image to firestore
          createPartner(imageId, downloadURL);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
      console.log("partner image uploaded");
    });
  };

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "partners");

  const createPartner = (imageId, downloadURL) => {
    // add author to firestore
    addDoc(postCollectionRef, {
      partnerName: partner.partnerName,
      partnerLogo: downloadURL,
      partnerLogoId: imageId,
      description: partner.description,
      link: partner.link,
    });
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "partner",
      action: "created",
    });
    console.log("company partner added", partner.partnerName);
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-green-400 underline uppercase">
          Create Company Partner
        </div>
        <br />

        {/* create partner form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* partner name input */}
            <label className="font-bold text-xl">
              Partner Name
              <RedStar />
            </label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="partnerName"
              value={partner.partnerName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* Logo picture input */}
            <label className="font-bold text-xl">
              Logo Picture
              <RedStar />{" "}
              <span className="font-normal text-sm">(no background image)</span>
            </label>
            <input
              className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
              type="file"
              name="partnerLogo"
              onChange={(e) => handleOnChange(e)}
            />

            {/* link input */}
            <label className="font-bold text-xl">Link</label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              placeholder="website or social media link (optional)..."
              type="text"
              name="link"
              value={partner.link}
              onChange={(e) => handleOnChange(e)}
            />

            {/* bio input */}
            <label className="font-bold text-xl">Description</label>
            <textarea
              placeholder="Write something about the partner (optional)..."
              rows={3}
              value={partner.description}
              name="description"
              onChange={(e) => handleOnChange(e)}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            />

            {/* create partner button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                partner.partnerName && partner.partnerLogo
                  ? uploadImageAndCreatePartner
                  : notify
              }
            >
              Create Partner
            </button>

            {/* toast alert */}
            <Toast />

            {/* button back */}
            <ButtonBack link="/partner" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePartner;
