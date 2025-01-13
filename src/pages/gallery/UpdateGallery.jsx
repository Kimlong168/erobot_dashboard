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
const UpdateGallery = () => {
  const { id: galleryParam } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [gallery, setGallery] = useState({
    name: null,
    url: null,
    imageId: "",
  });

  let navigate = useNavigate();

  // handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "url") {
      setGallery({
        ...gallery,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setGallery({
      ...gallery,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "gallery", galleryParam);

    // fetch a field of data from firebase by galleryParam to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          setGallery({
            name: data.name,
            url: null,
            imageId: data.imageId,
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
  }, [galleryParam]);

  //   update product if all required fields are filled
  async function updateGallery() {
    // navigate to product page in advance
    navigate("/gallery");
    // if image is not updated
    if (gallery.url === null) {
      const docRef = doc(db, "gallery", galleryParam);
      await setDoc(
        docRef,
        {
          name: gallery.name,
          url: oldImageUrl,
          imageId: gallery.imageId,
        },
        { merge: true }
      );
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `galleryImages/${gallery.imageId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log("gallery image deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `galleryImages/${gallery.imageId}`);
      uploadBytes(imageRef, gallery.url).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);

            // update data in the firestore with a new image url and new data
            updateGalleryAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new gallery image uploaded");
      });
    }

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "gallery",
      action: "updated",
    });

    console.log("gallery updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateAuthor function because we need to get the new image url first
  async function updateGalleryAndNewImage(newImageUrl) {
    const docRef = doc(db, "gallery", galleryParam);
    await setDoc(
      docRef,
      {
        name: gallery.name.trim() === "" ? "No name" : gallery.name,
        url: newImageUrl,
        imageId: gallery.imageId,
      },
      { merge: true }
    );
  }

  // loading until data is fetched
  if (gallery.name === null) {
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
          Update gallery image
        </div>
        <br />

        {/* create partner form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
            <legend className="text-xl uppercase font-bold text-purple-700">
              Update Image
            </legend>
            <div className="flex flex-col md:flex-row gap-5">
              <div>
                <label>Image name</label>
                <input
                  type="text"
                  name="name"
                  value={gallery.name}
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
                <button
                  onClick={gallery.url ? updateGallery : notify}
                  className="border px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-700"
                >
                  Update Gallery
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
      <ButtonBack link="/gallery" />
    </Layout>
  );
};

export default UpdateGallery;
