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
import { BsTrash } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const UpdateAuthor = () => {
  const { id: authorParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [author, setAuthor] = useState({
    fullName: null,
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
  let navigate = useNavigate();
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

  useEffect(() => {
    const docRef = doc(db, "authors", authorParams);

    // fetch a field of data from firebase by authorParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          // add the link box for user to fill
          const links =
            data.links.length == 0 ? [{ title: "", url: "" }] : data.links;

          setAuthor({
            fullName: data.fullName,
            bio: data.bio,
            position: data.position,
            links: links,
            authorImageId: data.authorImageId,
            //no need to get the image from firestore because we already have the image in the storage
            profilePicture: null,
          });

          // get old image url
          setOldImageUrl(data.profilePicture);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [authorParams]);

  //   update product if all required fields are filled
  async function updateAuthor() {
    // navigate to product page in advance
    navigate("/author");
    // if image is not updated
    if (author.profilePicture === null) {
      // filter empty link
      const links = author.links.filter(
        (item) => !(item.title === "" && item.url === "")
      );
      const docRef = doc(db, "authors", authorParams);
      await setDoc(
        docRef,
        {
          fullName: author.fullName,
          bio: author.bio,
          position: author.position,
          links: links,
          authorImageId: author.authorImageId,
          profilePicture: oldImageUrl,
        },
        { merge: true }
      );
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `authorImages/${author.authorImageId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log(author.name, "author image deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `authorImages/${author.authorImageId}`);
      uploadBytes(imageRef, author.profilePicture).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);

            // update data in the firestore with a new image url and new data
            updateAuthorAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new author image uploaded");
      });
    }
    // to update the data in the table
    setIsUpdated((prev) => !prev);

    setShowNotification({
      status: true,
      item: "author",
      action: "updated",
    });

    console.log("author updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateAuthor function because we need to get the new image url first
  async function updateAuthorAndNewImage(newImageUrl) {
    // filter empty link
    const links = author.links.filter(
      (item) => !(item.title === "" && item.url === "")
    );
    const docRef = doc(db, "authors", authorParams);
    await setDoc(
      docRef,
      {
        fullName: author.fullName,
        profilePicture: newImageUrl,
        authorImageId: author.authorImageId,
        bio: author.bio,
        position: author.position,
        links: links,
      },
      { merge: true }
    );
 
  }

  // loading until data is fetched
  if (author.fullName === null) {
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
        <div className="text-center p-4 font-bold text-3xl text-blue-400 underline uppercase">
          Update Author
        </div>
        <br />

        {/* create author categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* fullname input */}
            <label className="font-bold text-xl">
              Full Name <RedStar />
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
              placeholder="eg(author)"
              value={author.position}
              onChange={(e) => handleOnChange(e)}
            />

            {/* profile picture input */}
            <label className="font-bold text-xl">Profile Picture</label>
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
              onClick={author.fullName !== "" ? updateAuthor : notify}
            >
              Update Author
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

export default UpdateAuthor;
