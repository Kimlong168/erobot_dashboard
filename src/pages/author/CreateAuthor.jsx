import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Layout from "../../layouts/Layout";
import Toast from "../../utils/Toast";
import { BsTrash } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const CreateAuthor = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [author, setAuthor] = useState({
    fullName: "",
    profilePicture: null,
    bio: "",
    position: "",
    links: [
      {
        title: "",
        url: "",
      },
    ],
  });

  // add new link
  const addLink = () => {
    setAuthor({
      ...author,
      links: [...author.links, { title: "", url: "" }],
    });
  };

  // remove link
  const removeLink = (index) => {
    const updatedLinks = author.links.filter((_, i) => i !== index);
    setAuthor({
      ...author,
      links: updatedLinks,
    });
  };

  // handle onChange event for link
  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...author.links];
    updatedLinks[index][field] = value;
    setAuthor({
      ...author,
      links: updatedLinks,
    });
  };

  // handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "profilePicture") {
      setAuthor({
        ...author,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setAuthor({
      ...author,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImageAndCreateAuthor = () => {
    // navigate to the author page
    navigate(`/author`);

    const fullNameNoSpaces = author.fullName.replace(/\s+/g, "");
    const timestamp = new Date().getTime();

    // Concatenate full name and timestamp to create the ID
    const imageId = `${fullNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `authorImages/${imageId}`);
    uploadBytes(imageRef, author.profilePicture).then(() => {
      // Get the download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("profile image URL:", downloadURL);
          //store author and image to firestore
          createAuthor(imageId, downloadURL);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
      console.log("author image uploaded");
    });
  };

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "authors");

  const createAuthor = (imageId, downloadURL) => {
    // filter the empty link
    const links = author.links.filter(
      (item) => !(item.title === "" && item.url === "")
    );
    // add author to firestore
    addDoc(postCollectionRef, {
      fullName: author.fullName,
      profilePicture: downloadURL,
      bio: author.bio,
      position: author.position,
      links: links,
      authorImageId: imageId,
    });
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "author",
      action: "created",
    });
    console.log("author added", author.fullName);
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-blue-400 underline uppercase">
          Create Author
        </div>
        <br />

        {/* create author categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* fullname input */}
            <label className="font-bold text-xl">
              Full Name
              <RedStar />
            </label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="fullName"
              value={author.fullName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* position input */}
            <label className="font-bold text-xl">Position</label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="position"
              placeholder="example: author"
              value={author.position}
              onChange={(e) => handleOnChange(e)}
            />

            {/* profile picture input */}
            <label className="font-bold text-xl">
              Profile Picture
              <RedStar />
            </label>
            <input
              className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
              type="file"
              name="profilePicture"
              onChange={(e) => handleOnChange(e)}
            />

            {/* bio input */}
            <label className="font-bold text-xl">Bio</label>
            <textarea
              placeholder="Write something about the author..."
              rows={3}
              value={author.bio}
              name="bio"
              onChange={(e) => handleOnChange(e)}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            />

            {/* social media links input */}
            <h2 className="font-bold text-xl flex items-center justify-between mb-2">
              Social Media
              <button
                className="uppercase text-sm text-green-600 flex items-center gap-2"
                onClick={addLink}
              >
                Add Link
                <IoMdAddCircleOutline color="green" size="20" />
              </button>
            </h2>

            <div className="flex flex-col gap-1">
              {author.links.map((link, index) => (
                <div key={index} className="flex items-center gap-4 mb-3">
                  {/* link title input */}
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none "
                    type="text"
                    placeholder="Link title eg(Facebook,Tiktok,...)"
                    value={link.title}
                    onChange={(e) =>
                      handleLinkChange(index, "title", e.target.value)
                    }
                  />

                  {/* link url input */}
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none "
                    type="text"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) =>
                      handleLinkChange(index, "url", e.target.value)
                    }
                  />

                  {/* icon to delete each link */}
                  {author.links.length > 1 && (
                    <button
                      className="grid place-items-center"
                      title="remove link"
                      onClick={() => removeLink(index)}
                    >
                      <BsTrash color="red" size="20" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* create author button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                author.fullName !== "" && author.profilePicture !== null
                  ? uploadImageAndCreateAuthor
                  : notify
              }
            >
              Create Author
            </button>

            {/* toast alert */}
            <Toast />

            {/* button back */}
            <ButtonBack link="/author" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAuthor;
