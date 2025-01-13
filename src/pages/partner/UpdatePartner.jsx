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
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const UpdatePartner = () => {
  const { id: partnerParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [partner, setPartner] = useState({
    partnerName: null,
    partnerLogo: null,
    partnerLogoId: "",
    description: "",
    link: "",
  });

  let navigate = useNavigate();

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

  useEffect(() => {
    const docRef = doc(db, "partners", partnerParams);

    // fetch a field of data from firebase by partnerParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          setPartner({
            partnerName: data.partnerName,
            description: data.description,
            link: data.link,
            partnerLogoId: data.partnerLogoId,
            partnerLogo: null,
          });

          // get old image url
          setOldImageUrl(data.partnerLogo);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [partnerParams]);

  //   update product if all required fields are filled
  async function updatePartner() {
    // navigate to product page in advance
    navigate("/partner");
    // if image is not updated
    if (partner.partnerLogo === null) {
      const docRef = doc(db, "partners", partnerParams);
      await setDoc(
        docRef,
        {
          partnerName: partner.partnerName,
          description: partner.description,
          link: partner.link,
          partnerLogoId: partner.partnerLogoId,
          partnerLogo: oldImageUrl,
        },
        { merge: true }
      );
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `partnerImages/${partner.partnerLogoId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log(
            partner.partnerName,
            "partner logo image deleted successfully"
          );
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `partnerImages/${partner.partnerLogoId}`);
      uploadBytes(imageRef, partner.partnerLogo).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);

            // update data in the firestore with a new image url and new data
            updatePartnerAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new partner logo image uploaded");
      });
    }
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "partner",
      action: "updated",
    });
    console.log("partner updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateAuthor function because we need to get the new image url first
  async function updatePartnerAndNewImage(newImageUrl) {
    const docRef = doc(db, "partners", partnerParams);
    await setDoc(
      docRef,
      {
        partnerName: partner.partnerName,
        description: partner.description,
        link: partner.link,
        partnerLogoId: partner.partnerLogoId,
        partnerLogo: newImageUrl,
      },
      { merge: true }
    );
  }

  // loading until data is fetched
  if (partner.partnerName === null) {
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
        <div className="text-center p-4 font-bold text-3xl text-green-400 underline uppercase">
          Update Company Partner
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
              Logo Picture{" "}
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
              onClick={partner.partnerName ? updatePartner : notify}
            >
              Update Partner
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

export default UpdatePartner;
