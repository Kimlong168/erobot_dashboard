import Layout from "../../layouts/Layout";
import LinkIcon from "../../components/LinkIcon";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../contexts/DataContext";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import channelType1 from "../../assets/images/channel-type1.png";
import channelType2 from "../../assets/images/channel-type2.png";
import chatId from "../../assets/images/chatId.png";
import botId from "../../assets/images/botId.png";
import addAdmin from "../../assets/images/addAdmin.png";
const Contact = () => {
  const { contactList } = useContext(DataContext);
  const contact = contactList[0];
  const [showQandA, setShowQandA] = useState({
    q1: false,
    q2: false,
    q3: false,
  });
  const [time, setTime] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);

  if (!contact)
    return (
      <Layout>
        {time < 10 ? (
          <div>
            {time > 5 && (
              <span className="text-xl text-red-600">
                Please wait for 5s more...
              </span>
            )}
            <Loading />
          </div>
        ) : (
          <div>
            <div className="text-xl mb-4">
              Click the button below to create contact
            </div>
            <Link to="/createContact">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600">
                Create
              </button>
            </Link>
          </div>
        )}
      </Layout>
    );

  return (
    <Layout>
      <div className="w-full overflow-auto">
        <fieldset className="border border-gray-700 p-8 rounded-md shadow-md mb-10 relative">
          <legend className="text-xl md:text-4xl uppercase font-bold text-purple-500">
            Contact Information
          </legend>
          <table className="text-xl">
            <tbody>
              <tr>
                <td className="pr-10 pb-3">Phone Number:</td>
                <td className="pr-10 pb-3">{contact.phoneNumber}</td>
              </tr>
              <tr>
                <td className="pr-10 pb-3">Email:</td>
                <td className="pr-10 pb-3">{contact.email}</td>
              </tr>

              <tr>
                <td className="pr-10 pb-3">Social Media:</td>
                <td className="pr-10 pb-3">
                  <div className="flex flex-wrap gap-3">
                    {contact.socialMedia &&
                      contact.socialMedia.map((item, index) => (
                        <Link to={item.url} key={index}>
                          <LinkIcon title={item.title} />
                        </Link>
                      ))}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="pr-10 pb-3">Telegram Bot Id (API Token):</td>
                <td className="pr-10 pb-3">
                  {contact.telegramBotId}{" "}
                  {contact.botUrl && (
                    <Link
                      to={contact.botUrl}
                      className="text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      (Link)
                    </Link>
                  )}
                </td>
              </tr>

              <tr>
                <td className="pr-10 pb-3">Chat Id (Telegram Channel Id):</td>
                <td className="pr-10 pb-3">
                  {contact.chatId}{" "}
                  {contact.channelUrl && (
                    <Link
                      to={contact.channelUrl}
                      className="text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      (Link)
                    </Link>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {/* button */}
          {contactList.length > 0 ? (
            <Link to={`/updateContact/${contact.id}`}>
              <button className="absolute top-0 right-4 px-4 py-1.5 rounded hover:shadow-xl text-sm text-white font-bold bg-green-600 flex gap-3 justify-center items-center">
                <FiEdit /> Edit
              </button>
            </Link>
          ) : (
            <button className="bg-red-500 absolute top-0 right-4 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600">
              Create
            </button>
          )}
        </fieldset>

        <div className="mt-4 prose prose-a:underline prose-a:text-blue-500">
          <h2 className="flex items-center gap-3">
            <FaQuestionCircle />
            FAQ
          </h2>
          <div>
            <div
              onClick={() =>
                setShowQandA({
                  ...showQandA,
                  q1: !showQandA.q1,
                })
              }
              className="px-2 flex items-center gap-4 mb-4"
            >
              <span className="bg-yellow-500 px-2 rounded cursor-pointer">
                1. តើ Bot Id និង Chat Id ជាអ្វី?
              </span>
              <div>
                <FaArrowAltCircleDown className="cursor-pointer" />
              </div>
            </div>
            {showQandA.q1 && (
              <div>
                <p>
                  នៅក្នុង Telegram, Bot Id គឺជាលេខអត្តសញ្ញាណតែមួយគត់សម្រាប់គណនី
                  bot។ Bot Id ត្រូវបានផ្តល់ដោយ{" "}
                  <Link to="https://t.me/BotFather">BotFather</Link>{" "}
                  នៅពេលដែលយើងបង្កើត Bot នេះឡើង។
                </p>
                <p>
                  Chat ID គឺជាលេខអត្តសញ្ញាណតែមួយគត់សម្រាប់ Telegram Channel
                  ឫគណនីTelegramផ្ទាល់ខ្លួនរបស់យើង។ នៅក្នុងករណីរបស់យើង យើងប្រើ
                  Telegram Channel ដើម្បីទទួលសារពី Telegram bot
                  បន្ទាប់ពីអតិថិជនបានចុចកម្មង់រួច។
                </p>

                <p>
                  ដូច្នេះសរុបមក Telegram bot ត្រូវបានប្រើដើម្បីផ្ញើសារ និង
                  Telegram Channel ត្រូវបានប្រើដើម្បីទទួលសារ។
                </p>

                <b>
                  បញ្ជាក់៖ ពេលបង្កើត Telegram Channel យើងត្រូវជ្រើសរើសប្រភេទនៃ
                  Channel ជា Private Channel (ដូចរូប)
                  ដើម្បីការពារកុំអោយមនុស្សទូទៅចូលមើលបាន។
                  <div>
                    <img src={channelType1} alt="channelType" />
                  </div>
                  <p>ឫចូលកែនៅពេលបង្កើតរួច</p>
                  <div>
                    <img src={channelType2} alt="channelType" />
                  </div>
                </b>
              </div>
            )}
          </div>
          <div>
            <div
              onClick={() =>
                setShowQandA({
                  ...showQandA,
                  q2: !showQandA.q2,
                })
              }
              className="px-2 flex items-center gap-4 mb-4"
            >
              <span className="bg-yellow-500 px-2 rounded  cursor-pointer">
                2. តើយើងទៅយក Bot Id និង Chat Id ដោយរបៀបណាករណី Channel និង Bot
                ចាស់របស់យើងខូច ឬត្រូវបានគេ Hack?
              </span>
              <div>
                <FaArrowAltCircleDown className="cursor-pointer" />
              </div>
            </div>
            {showQandA.q2 && (
              <div>
                <p>
                  នៅពេលដែលយើងបង្កើត bot នៅក្នុង Telegram នោះ{" "}
                  <Link to="https://t.me/BotFather">BotFather</Link> នឹងផ្តល់
                  bot Id (API Token)។ យើងត្រូវ copy Bot id នោះមកបញ្ចូលក្នង
                  System។
                  <div>
                    <img src={botId} alt="botId" />
                  </div>
                </p>
                <p>
                  ដើម្បីទទួលបាន Chat Id យើងត្រូវូសរសេរសារអ្វីមួយក៏បាននៅក្នុង
                  Telegram Channel ដែលយើងបានបង្កើត រួចបញ្ជូនសារនោះ (forward)
                  ទៅកាន់ <Link to="https://t.me/getidsbot">Getidsbot</Link>{" "}
                  ហើយរកមើលពាក្យ Origin Chat រួចហើយចម្លងលេខសម្គាល់ (Id or Chat
                  Id) នៅខាងក្រោមនោះមកបញ្ចូលក្នង System។
                  <div>
                    <img src={chatId} alt="chatId" />
                  </div>
                </p>
                <p>
                  <ul>
                    <li>
                      <Link to="https://youtu.be/aNmRNjME6mE?si=2dP2CcmCRMVF0Uhp">
                        How to create a new bot?
                      </Link>
                      <p>
                        <iframe
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/aNmRNjME6mE?si=2dP2CcmCRMVF0Uhp"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                        ></iframe>
                      </p>
                    </li>
                    <li>
                      <Link to="https://youtu.be/jyE2Wlm575g?si=bp7eENWZrGtY4rcn">
                        How to get chat id (telgram channel id)?
                      </Link>
                      <p>
                        <iframe
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/jyE2Wlm575g?si=c8Ovxkxe6X6WuEO1&amp;start=162"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                        ></iframe>
                      </p>
                    </li>
                  </ul>
                </p>
              </div>
            )}
          </div>

          <div>
            <div
              onClick={() =>
                setShowQandA({
                  ...showQandA,
                  q3: !showQandA.q3,
                })
              }
              className="px-2 flex items-center gap-4 mb-4"
            >
              <span className="bg-yellow-500 px-2 rounded  cursor-pointer">
                3. បន្ទាប់ពីទទួលបាន Bot Id និង Chat Id និងបានបញ្ចូលនៅក្នុង
                system រួចរាល់ តើយើងត្រូវធ្វើអ្វីបន្ទាប់ទៀតដើម្បីអោយ Bot និង
                Telegram Channel របស់យើងធ្វើការជាមួយគ្នាបាន?
              </span>
              <div>
                <FaArrowAltCircleDown className="cursor-pointer" />
              </div>
            </div>
            {showQandA.q3 && (
              <div>
                <p>
                  បន្ទាប់ពីទទួលបាន Bot Id និង Chat Id និងបានបញ្ចូលនៅក្នុង system
                  រួចរាល់យើងត្រូវ promote Bot របស់យើងជា admin នៃ Telegram
                  Channel របស់យើងជាការស្រច។
                </p>
                <p>
                  ដើម្បី promote Bot របស់យើងជា admin យើងត្រូវ៖ <br />
                  ១. ចូលទៅកាន់ Telegram Channel របស់យើង។ <br />
                  ២. ចុច Manage Channel <br />
                  ៣. ចុចលើ សញ្ញាចុច៣
                  <div className="ml-3  rounded-md rotate-90 w-fit inline-block font-bold text-xl text-center">
                    ...
                  </div>
                  <br />
                  ៤. ចុចលើ Subscribers រួច Add Bot របស់យើង ជា subscriber/user
                  របស់ Channel
                  <br />
                  ៥. ចុច Administrators
                  <br />
                  ៦. ចុចលើ Add Administrator
                  <br />
                  ៧. ចុចលើ Search រួចវាយឈ្មោះរបស់ Bot របស់យើង
                  <br />
                  ៨. ចុចលើ Bot របស់យើង
                  <br />
                  ៩. ចុចលើ Save ជាការស្រេច៕
                  <br />
                </p>
                <div>
                  <img src={addAdmin} alt="addAdmin" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
