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
const UpdateSticker = () => {
  const { id: stickerParam } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [sticker, setSticker] = useState({
    name: null,
    url: null,
    imageId: "",
    version: "",
  });

  let navigate = useNavigate();

  // handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "url") {
      setSticker({
        ...sticker,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setSticker({
      ...sticker,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "stickers", stickerParam);

    // fetch a field of data from firebase by stickerParam to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          setSticker({
            name: data.name,
            url: null,
            imageId: data.imageId,
            version: data.version,
          });

          // get old image url
          setOldImageUrl(data.url);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [stickerParam]);

  //   update product if all required fields are filled
  async function updatesticker() {
    // navigate to product page in advance
    navigate("/sticker");
    // if image is not updated
    if (sticker.url === null) {
      const docRef = doc(db, "stickers", stickerParam);
      await setDoc(
        docRef,
        {
          name: sticker.name,
          url: oldImageUrl,
          imageId: sticker.imageId,
          version: sticker.version,
        },
        { merge: true }
      );
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `stickerImages/${sticker.imageId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log("sticker image deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `stickerImages/${sticker.imageId}`);
      uploadBytes(imageRef, sticker.url).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);

            // update data in the firestore with a new image url and new data
            updatestickerAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new sticker image uploaded");
      });
    }

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "sticker",
      action: "updated",
    });

    console.log("sticker updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateAuthor function because we need to get the new image url first
  async function updatestickerAndNewImage(newImageUrl) {
    const docRef = doc(db, "stickers", stickerParam);
    await setDoc(
      docRef,
      {
        name: sticker.name.trim() === "" ? "No name" : sticker.name,
        url: newImageUrl,
        imageId: sticker.imageId,
        version: sticker.version,
      },
      { merge: true }
    );
  }

  // loading until data is fetched
  if (sticker.name === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-purple-900 underline uppercase">
          Update Sticker
        </div>
        <br />

        {/* create partner form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
            <legend className="text-xl uppercase font-bold text-purple-700">
              Update sticker
            </legend>
            <div className="flex flex-col md:flex-row gap-5">
              <div>
                <label>Sticker name</label>
                <input
                  type="text"
                  name="name"
                  value={sticker.name}
                  className="border border-gray-300 p-2 rounded w-full outline-none mb-5"
                  onChange={handleOnChange}
                />
                <label>
                  Choose an image
                  <RedStar />
                </label>
                <input
                  type="file"
                  name="url"
                  className="border border-gray-300 p-2 rounded w-full outline-none mb-5"
                  onChange={handleOnChange}
                />
                <label>Version</label>
                <input
                  type="text"
                  name="version"
                  placeholder="version (eg. 1,2,3)"
                  value={sticker.version}
                  className="border border-gray-300 p-2 rounded w-full outline-none mb-5"
                  onChange={handleOnChange}
                />
                <button
                  onClick={
                    sticker.url && sticker.version ? updatesticker : notify
                  }
                  className="border px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-700"
                >
                  Update Sticker
                </button>
              </div>

              <div>
                <div>Old Image</div>
                <img
                  src={oldImageUrl}
                  alt="old image"
                  width={300}
                  className="border rounded"
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* toast alert */}
      <Toast />

      {/* button back */}
      <ButtonBack link="/sticker" />
    </Layout>
  );
};

export default UpdateSticker;
