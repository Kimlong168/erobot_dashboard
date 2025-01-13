import { useContext, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import notify from "../../utils/Notify";
import { BsTrash } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import validateEmail from "../../utils/validateEmail";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
const CreateContact = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const [contact, setContact] = useState({
    phoneNumber: "",
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
  const postCollectionRef = collection(db, "contact");

  const createContact = () => {
    // if the email is not valid
    if (!validateEmail(contact.email)) {
      alert("Email is valid");
      setContact({
        ...contact,
        email: "",
      });
    } else {
      // if the email is valid

      navigate(`/contact`);
      // add author to firestore
      addDoc(postCollectionRef, {
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        telegram: contact.telegram,
        socialMedia: contact.socialMedia,
        telegramBotId: contact.telegramBotId.trim(),
        chatId: contact.chatId.trim(),
        botUrl: contact.botUrl,
        channelUrl: contact.channelUrl,
      });
      // to update the data in the table
      setIsUpdated((prev) => !prev);
      console.log("company contact added");
    }
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-purple-400 underline uppercase">
          Create Company Award
        </div>
        <br />

        {/* create dynamic data form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* contact section */}
            <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
              <legend className="text-xl uppercase font-bold text-purple-500">
                Contact Information
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
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="telegramBotId"
                    value={contact.telegramBotId}
                    placeholder="example : 6882060062:AAFvZvxBHu1kqu_n5BgPpsx4V1dGoSqHXBw"
                    onChange={(e) => handleContactChange(e)}
                  />
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
                  <input
                    className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                    type="text"
                    name="chatId"
                    value={contact.chatId}
                    placeholder="example : -1002126940474"
                    onChange={(e) => handleContactChange(e)}
                  />
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
            </fieldset>

            {/* create partner button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                contact.email &&
                contact.phoneNumber &&
                contact.telegram &&
                contact.socialMedia &&
                contact.telegramBotId &&
                contact.chatId
                  ? createContact
                  : notify
              }
            >
              Create Contact
            </button>

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

export default CreateContact;
