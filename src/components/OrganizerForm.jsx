import { useState } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase-config";
import notify from "../utils/Notify";
const OrganizerForm = ({ title, organizers, setOrganizers }) => {
  const [newOrganizer, setNewOrganizer] = useState({ name: "", logo: "" });

  const handleOrganizerChange = (e) => {
    const { name, value } = e.target;

    if (name === "logo") {
      setNewOrganizer((prev) => ({ ...prev, [name]: e.target.files[0] }));
      return;
    }

    setNewOrganizer((prev) => ({ ...prev, [name]: value }));
  };

  const addorganizer = async () => {
    if (newOrganizer.name && newOrganizer.logo) {
      uploadImage(newOrganizer);
      setNewOrganizer({ name: "", logo: "" }); // Reset input fields
    } else {
      notify("Please fill all fields to add organizer", "error");
    }
  };

  const removeorganizer = (imageId) => {
    deleteImageFromStorage(imageId);
    setOrganizers((prev) =>
      prev.filter((organizer) => organizer.imageId !== imageId)
    );
  };

  // upload image to firebase storage
  const uploadImage = (organizer) => {
    // Concatenate full name and timestamp to create the ID
    const productNameNoSpaces = organizer.name.replace(/\s+/g, "");
    const timestamp = new Date().getTime();
    const imageId = `${productNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `organizerImages/${imageId}`);
    uploadBytes(imageRef, organizer.logo).then(() => {
      // Get the download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("image URL:", downloadURL);
          // createProduct(downloadURL, imageId);
          setOrganizers((prev) => [
            ...prev,
            {
              logo: downloadURL,
              imageId: imageId,
              name: organizer.name,
            },
          ]);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });

      console.log("Org image uploaded");
    });
  };

  // delete image from firebase storage
  const deleteImageFromStorage = (imageId) => {
    const storageRef = ref(storage, `organizerImages/${imageId}`);
    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        console.log("image deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">{title}</h1>{" "}
      </div>
      <div className="mb-5">
        {organizers.map((organizer) => (
          <div
            key={organizer.id}
            className="flex items-center justify-between border-b pb-2 mb-2"
          >
            <div className="flex items-center gap-5">
              <p>
                <strong>Name:</strong> {organizer.name}
              </p>
              <p className="flex gap-5 items-center">
                <strong>Logo:</strong>{" "}
                <img width={80} src={organizer.logo} alt={organizer.name} />
              </p>
            </div>
            <button
              className="bg-red-500 text-white w-9 h-9 p-1 rounded grid place-content-center"
              onClick={() => removeorganizer(organizer.imageId)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center  gap-3 mb-5">
        <input
          type="text"
          name="name"
          placeholder="Organizer Name"
          className="border border-gray-700 p-2 rounded w-full"
          value={newOrganizer.name}
          onChange={handleOrganizerChange}
        />
        <input
          type="file"
          name="logo"
          placeholder="organizer Role"
          className="border border-gray-700 p-2 rounded w-full"
          // value={newOrganizer.role}
          onChange={handleOrganizerChange}
        />
        <div>
          <button
            className="bg-green-600 text-white w-9 h-9 rounded p-1 grid place-content-center"
            onClick={addorganizer}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

OrganizerForm.propTypes = {
  title: PropTypes.string,
  organizers: PropTypes.array,
  setOrganizers: PropTypes.func,
};

export default OrganizerForm;
