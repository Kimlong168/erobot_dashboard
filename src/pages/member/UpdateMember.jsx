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
const UpdateMember = () => {
  const { id: memberParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [member, setMember] = useState({
    fullName: null,
    profilePicture: null,
    bio: "",
    team: "",
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
    setMember({
      ...member,
      links: [...member.links, { title: "", url: "" }],
    });
  };

  // remove link
  const removeLink = (index) => {
    const updatedLinks = member.links.filter((_, i) => i !== index);
    setMember({
      ...member,
      links: updatedLinks,
    });
  };

  // handle onChange event for link
  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...member.links];
    updatedLinks[index][field] = value;
    setMember({
      ...member,
      links: updatedLinks,
    });
  };

  // handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "profilePicture") {
      setMember({
        ...member,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setMember({
      ...member,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "members", memberParams);

    // fetch a field of data from firebase by memberParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          // add the link box for user to fill
          const links =
            data.links.length == 0 ? [{ title: "", url: "" }] : data.links;

          setMember({
            fullName: data.fullName,
            bio: data.bio,
            team: member.team,
            position: data.position,
            links: links,
            memberImageId: data.memberImageId,
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
  }, [memberParams]);

  //   update product if all required fields are filled
  async function updatemember() {
    // navigate to product page in advance
    navigate("/member");
    // if image is not updated
    if (member.profilePicture === null) {
      // filter empty link
      const links = member.links.filter(
        (item) => !(item.title === "" && item.url === "")
      );
      const docRef = doc(db, "members", memberParams);
      await setDoc(
        docRef,
        {
          fullName: member.fullName,
          bio: member.bio,
          team: member.team,
          position: member.position,
          links: links,
          memberImageId: member.memberImageId,
          profilePicture: oldImageUrl,
        },
        { merge: true }
      );
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `memberImages/${member.memberImageId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log(member.name, "member image deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `memberImages/${member.memberImageId}`);
      uploadBytes(imageRef, member.profilePicture).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);

            // update data in the firestore with a new image url and new data
            updatememberAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new member image uploaded");
      });
    }
    // to update the data in the table
    setIsUpdated((prev) => !prev);

    setShowNotification({
      status: true,
      item: "member",
      action: "updated",
    });

    console.log("member updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updatemember function because we need to get the new image url first
  async function updatememberAndNewImage(newImageUrl) {
    // filter empty link
    const links = member.links.filter(
      (item) => !(item.title === "" && item.url === "")
    );
    const docRef = doc(db, "members", memberParams);
    await setDoc(
      docRef,
      {
        fullName: member.fullName,
        profilePicture: newImageUrl,
        memberImageId: member.memberImageId,
        bio: member.bio,
        team: member.team,
        position: member.position,
        links: links,
      },
      { merge: true }
    );
  }

  // loading until data is fetched
  if (member.fullName === null) {
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
          Update member
        </div>
        <br />

        {/* create member categort form */}
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
              value={member.fullName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* team input */}
            <label className="font-bold text-xl">Team</label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="team"
              placeholder="example: Social Media"
              value={member.team}
              onChange={(e) => handleOnChange(e)}
            />

            {/* position input */}
            <label className="font-bold text-xl">Position</label>
            <select
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              name="position"
              value={member.position}
              onChange={(e) => handleOnChange(e)}
            >
              <option value="">Select Position</option>
              <option value="Member">Member</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Alumni">Alumni</option>
              <option value="Founder">Founder</option>
              <option value="Co-founder">Co-founder</option>
            </select>

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
              placeholder="Write something about the member..."
              rows={3}
              value={member.bio}
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
              {member.links.map((link, index) => (
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
                  {member.links.length > 1 && (
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

            {/* create member button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={member.fullName !== "" ? updatemember : notify}
            >
              Update member
            </button>

            {/* toast alert */}
            <Toast />

            {/* button back */}
            <ButtonBack link="/member" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateMember;
