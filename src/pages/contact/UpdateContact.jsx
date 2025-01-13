import { useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layouts/Layout";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import { BsTrash } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import validateEmail from "../../utils/validateEmail";
import Loading from "../../components/Loading";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { FaLock, FaUnlock } from "react-icons/fa6";
import { DataContext } from "../../contexts/DataContext";
const UpdateContact = () => {
  const { id: contactParams } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const {setShowNotification} = useContext(DataContext);
  const [contact, setContact] = useState({
    phoneNumber: null,
    email: "",
    telegram: "",
    socialMedia: [
      {
        title: "",
        url: "",
      },
    ],
    telegramBotId: "", //the bot id for telegram bot that we use to send message to the admin (bot API token)
    chatId: "", // the chat_id here can be user_id or channel_id which allow bot to send message to the user or channel
    botUrl: "",
    channelUrl: "",
  });
  const [inputBotIdDisabled, setInputBotIdDisabled] = useState(true);
  const [inputChatIdDisabled, setInputChatIdDisabled] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "contact", contactParams);

    // fetch a field of data from firebase by contactParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);
          setContact({
            phoneNumber: data.phoneNumber,
            email: data.email,
            telegram: data.telegram,
            socialMedia: data.socialMedia,
            telegramBotId: data.telegramBotId,
            chatId: data.chatId,
            botUrl: data.botUrl,
            channelUrl: data.channelUrl,
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [contactParams]);

  // handle onChange event for input
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (index, e) => {
    const { name, value } = e.target;
    setContact((prevContact) => {
      const updatedSocialMedia = [...prevContact.socialMedia];
      updatedSocialMedia[index] = {
        ...updatedSocialMedia[index],
        [name]: value,
      };
      return { ...prevContact, socialMedia: updatedSocialMedia };
    });
  };

  // add new link
  const addLink = () => {
    setContact({
      ...contact,
      socialMedia: [...contact.socialMedia, { title: "", url: "" }],
    });
  };

  // remove link
  const removeLink = (index) => {
    const updatedLinks = contact.socialMedia.filter((_, i) => i !== index);
    setContact({
      ...contact,
      socialMedia: updatedLinks,
    });
  };

  let navigate = useNavigate();

  async function updateContact() {
    // confirm before updating the data because it's important
    const confirm = window.confirm("Are you sure you want to update?");
    if (!confirm) return;

    const docRef = doc(db, "contact", contactParams);
    if (!validateEmail(contact.email)) {
      alert("Please enter a valid email address");
      setContact({
        ...contact,
        email: "",
      });
      return;
    }
    await setDoc(
      docRef,
      {
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        telegram: contact.telegram,
        socialMedia: contact.socialMedia,
        telegramBotId: contact.telegramBotId.trim(),
        chatId: contact.chatId.trim(),
        botUrl: contact.botUrl,
        channelUrl: contact.channelUrl,
      },
      { merge: true }
    );
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "contact",
      action: "updated",
    });

    navigate("/contact");
  }
  if (contact.phoneNumber === null) {
    return (
      <>
        <Layout>
          <Loading />
        </Layout>
      </>
    );
  }

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded mt-5">
        {/* update contact data form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* contact section */}
            <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
              <legend className="text-xl md:text-4xl uppercase font-bold text-purple-500">
                Update Contact Information
              </legend>
              {/* email name input */}
              <label className="font-bold text-xl">
                Phone number
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                placeholder="example: 012345678"
                type="tel"
                name="phoneNumber"
                value={contact.phoneNumber}
                onChange={(e) => handleContactChange(e)}
              />
              {/* email name input */}
              <label className="font-bold text-xl">
                Email
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="email"
                name="email"
                value={contact.email}
                onChange={(e) => handleContactChange(e)}
              />
              {/* telegram name input */}
              <label className="font-bold text-xl">
                Telegram username
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="text"
                name="telegram"
                placeholder="example : https://t.me/kimlong_chann"
                value={contact.telegram}
                onChange={(e) => handleContactChange(e)}
              />

              {/* bot api token and url */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <div className="lg:w-3/5">
                  {/* telegram bot id or api token */}
                  <label className="font-bold text-xl">
                    Telegram Bot Id (API token)
                    <RedStar />
                  </label>
                  <div className="flex items-center justify-between gap-2 border border-gray-700 p-2 mb-5  rounded ">
                    <input
                      disabled={inputBotIdDisabled}
                      title="click to enable or disable the input field"
                      className={`border-none w-full outline-none ${
                        inputBotIdDisabled && "text-red-500"
                      }`}
                      type="text"
                      name="telegramBotId"
                      value={contact.telegramBotId}
                      placeholder="example : 6882060062:AAFvZvxBHu1kqu_n5BgPpsx4V1dGoSqHXBw"
                      onChange={(e) => handleContactChange(e)}
                    />
                    {inputBotIdDisabled ? (
                      <span
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => setInputBotIdDisabled(false)}
                      >
                        <FaLock />
                      </span>
                    ) : (
                      <span
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => setInputBotIdDisabled(true)}
                      >
                        <FaUnlock />
                      </span>
                    )}
                  </div>
                </div>
                <div className="lg:w-2/5">
                  {/* telegram bot url */}
                  <label className="font-bold text-xl">Telegram Bot Url</label>
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="botUrl"
                    value={contact.botUrl}
                    placeholder="exmaple: https://t.me/sorakhmer_bot"
                    onChange={(e) => handleContactChange(e)}
                  />
                </div>
              </div>

              {/* channel id and url */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <div className="lg:w-3/5">
                  {/* chat id or channel id or user id*/}
                  <label className="font-bold text-xl">
                    Chat Id (Telegram Channel Id)
                    <RedStar />
                  </label>
                  <div className="flex items-center justify-between gap-2 border border-gray-700 p-2 mb-5  rounded ">
                    <input
                      disabled={inputChatIdDisabled}
                      title="click to enable or disable the input field"
                      className={`border-none w-full outline-none ${
                        inputChatIdDisabled && "text-red-500"
                      }`}
                      type="text"
                      name="chatId"
                      value={contact.chatId}
                      placeholder="example : -1002126940474"
                      onChange={(e) => handleContactChange(e)}
                    />
                    {inputChatIdDisabled ? (
                      <span
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => setInputChatIdDisabled(false)}
                      >
                        <FaLock />
                      </span>
                    ) : (
                      <span
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => setInputChatIdDisabled(true)}
                      >
                        <FaUnlock />
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:w-2/5">
                  {/* channel url or where to recieve the message*/}
                  <label className="font-bold text-xl">Channel Url</label>
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="channelUrl"
                    value={contact.channelUrl}
                    placeholder="example : https://t.me/+SVs-mS5M-XFhNDk1"
                    onChange={(e) => handleContactChange(e)}
                  />
                </div>
              </div>

              {/* social media input */}
              <h2 className="font-bold text-xl flex items-center justify-between mb-2">
                <div>
                  Social Media
                  <RedStar />
                </div>
                <button
                  className="uppercase text-sm text-green-600 flex items-center gap-2"
                  onClick={addLink}
                >
                  Add Link
                  <IoMdAddCircleOutline color="green" size="20" />
                </button>
              </h2>

              {contact.socialMedia.map((socialMedia, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="title"
                    placeholder="title"
                    value={socialMedia.title}
                    onChange={(e) => handleSocialMediaChange(index, e)}
                  />
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="url"
                    name="url"
                    placeholder="url"
                    value={socialMedia.url}
                    onChange={(e) => handleSocialMediaChange(index, e)}
                  />

                  {/* icon to delete each link */}
                  {contact.socialMedia.length > 1 && (
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

              {/* update contact button */}
              <button
                className="bg-gray-700 text-white font-bold p-2 mt-2 rounded w-full"
                onClick={
                  contact.email &&
                  contact.phoneNumber &&
                  contact.telegram &&
                  contact.socialMedia &&
                  contact.telegramBotId &&
                  contact.chatId
                    ? updateContact
                    : notify
                }
              >
                Update Contact
              </button>
            </fieldset>

            {/* toast alert */}
            <Toast />

            {/* button back */}
            <ButtonBack link="/contact" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateContact;
