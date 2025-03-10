import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase-config";
import { useContext, useState } from "react";
import Layout from "../../layouts/Layout";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
function CreateSticker() {
  const [images, setImages] = useState(null);
  const [version, setVersion] = useState(1);
  // update context
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  let navigate = useNavigate();

  const uploadFiles = async () => {
    // navigate to gallery page
    navigate("/sticker");
    // upload images to firebase storage
    for (let i = 0; i < images.length; i++) {
      const fullNameNoSpaces = images[i].name.replace(/\s+/g, "");
      const timestamp = new Date().getTime();
      // Concatenate full name and timestamp to create the ID
      const imageId = `${fullNameNoSpaces}_${timestamp}`;

      const imageRef = ref(storage, `stickerImages/${imageId}`);
      await uploadBytes(imageRef, images[i])
        .then(() => {
          // Get the download URL for the uploaded image
          getDownloadURL(imageRef)
            .then((downloadURL) => {
              console.log("sticker image URL:", downloadURL);
              //store author and image to firestore

              const myCollection = collection(db, "stickers");
              addDoc(myCollection, {
                name: images[i].name,
                url: downloadURL,
                imageId: imageId,
                version: version,
              });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });

          console.log("success");
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "sticker",
      action: "created",
    });
  };

  return (
    <Layout>
      <div>
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-purple-900 underline uppercase">
          Upload sticker image
        </div>
        <br />
        {/* upload image */}

        <div></div>

        <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
          <legend className="text-xl uppercase font-bold text-purple-700">
            Upload Images
          </legend>
          <div className=" text-gray-600 ">
            You can select multiple images to upload at once.
          </div>
          <br />
          <input
            type="file"
            className="border border-gray-300 p-2 rounded w-full outline-none mb-5"
            multiple
            onChange={(event) => {
              setImages(event.target.files);
            }}
          />
          <label>Version</label>
          <input
            type="text"
            placeholder="version (eg. 1,2,3)"
            name="version"
            value={version}
            className="border border-gray-300 p-2 rounded w-full outline-none mb-5"
            onChange={(e) => setVersion(e.target.value)}
          />
          <button
            onClick={images && version ? uploadFiles : notify}
            className="border px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-700"
          >
            Upload
          </button>
        </fieldset>
        {/* toast alert */}
        <Toast />

        {/* button back */}
        <ButtonBack link="/sticker" />
      </div>
    </Layout>
  );
}
export default CreateSticker;
