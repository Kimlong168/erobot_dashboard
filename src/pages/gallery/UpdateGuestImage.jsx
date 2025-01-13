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
const UpdateGuestImage = () => {
  const { id: guestParam } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [guest, setGuest] = useState({
    name: null,
    url: null,
    imageId: "",
  });

  let navigate = useNavigate();

  // handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "url") {
      setGuest({
        ...guest,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setGuest({
      ...guest,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "guestImages", guestParam);

    // fetch a field of data from firebase by guestParam to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          setGuest({
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
  }, [guestParam]);

  //   update product if all required fields are filled
  async function updateguest() {
    // navigate to product page in advance
    navigate("/gallery");
    // if image is not updated
    if (guest.url === null) {
      const docRef = doc(db, "guestImages", guestParam);
      await setDoc(
        docRef,
        {
          name: guest.name,
          url: oldImageUrl,
          imageId: guest.imageId,
        },
        { merge: true }
      );
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `guestImages/${guest.imageId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log("guestImages deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `guestImages/${guest.imageId}`);
      uploadBytes(imageRef, guest.url).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);

            // update data in the firestore with a new image url and new data
            updateguestAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new guestImages uploaded");
      });
    }

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "image",
      action: "updated",
    });

    console.log("guest updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateAuthor function because we need to get the new image url first
  async function updateguestAndNewImage(newImageUrl) {
    const docRef = doc(db, "guestImages", guestParam);
    await setDoc(
      docRef,
      {
        name: guest.name.trim() === "" ? "No name" : guest.name,
        url: newImageUrl,
        imageId: guest.imageId,
      },
      { merge: true }
    );
  }

  // loading until data is fetched
  if (guest.name === null) {
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
          Update guest image
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
                  value={guest.name}
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
                  onClick={guest.url ? updateguest : notify}
                  className="border px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-700"
                >
                  Update guest
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

export default UpdateGuestImage;
