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
const CreateMember = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [member, setMember] = useState({
    fullName: "",
    profilePicture: null,
    bio: "",
    team: "",
    position: "Member",
    links: [
      {
        title: "",
        url: "",
      },
    ],
  });

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

  const uploadImageAndCreatemember = () => {
    // navigate to the member page
    navigate(`/member`);

    const fullNameNoSpaces = member.fullName.replace(/\s+/g, "");
    const timestamp = new Date().getTime();

    // Concatenate full name and timestamp to create the ID
    const imageId = `${fullNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `memberImages/${imageId}`);
    uploadBytes(imageRef, member.profilePicture).then(() => {
      // Get the download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("profile image URL:", downloadURL);
          //store member and image to firestore
          createmember(imageId, downloadURL);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
      console.log("member image uploaded");
    });
  };

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "members");

  const createmember = (imageId, downloadURL) => {
    // filter the empty link
    const links = member.links.filter(
      (item) => !(item.title === "" && item.url === "")
    );
    // add member to firestore
    addDoc(postCollectionRef, {
      fullName: member.fullName,
      profilePicture: downloadURL,
      bio: member.bio,
      team: member.team,
      position: member.position,
      links: links,
      memberImageId: imageId,
    });
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "member",
      action: "created",
    });
    console.log("member added", member.fullName);
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-blue-400 underline uppercase">
          Create Member
        </div>
        <br />

        {/* create member categort form */}
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
              value={member.fullName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* team input */}
            <label className="font-bold text-xl">Team</label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="member"
              placeholder="example: Social Media"
              value={member.member}
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
              onClick={
                member.fullName !== "" && member.profilePicture !== null
                  ? uploadImageAndCreatemember
                  : notify
              }
            >
              Create Member
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

export default CreateMember;
