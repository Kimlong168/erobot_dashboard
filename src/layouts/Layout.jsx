import { RxDashboard } from "react-icons/rx";
import { BiCategoryAlt } from "react-icons/bi";
import { FaBlog, FaProjectDiagram } from "react-icons/fa";
import { FiUsers, FiMail, FiUser } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { HiOutlineLogout } from "react-icons/hi";
import { FaSteamSymbol, FaAward, FaShoppingBasket } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/images/whiteLogo.png";
import { PiImage } from "react-icons/pi";
import "../App.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import ToggleLightDarkMode from "../components/ToggleLightDarkMode";
import Notification from "../components/Notification";
import { DataContext } from "../contexts/DataContext";
const Layout = (props) => {
  const { setIsAuth, userEmail } = useContext(AuthContext);
  const { showNotification, countNewOrder } = useContext(DataContext);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const tab = localStorage.getItem("activeTab");
    if (tab) {
      setActiveTab(tab);
    }
  }, []);
  // handleChange active tab
  const handleChangeTab = (tab) => {
    localStorage.setItem("activeTab", tab);
  };

  const userName = userEmail.split("@")[0];
  let navigate = useNavigate();

  // sign user out function
  const signUserOut = () => {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");

    if (confirmSignOut) {
      signOut(auth).then(() => {
        navigate("/login");
        localStorage.clear();
        console.log("Signed Out");
        setIsAuth(false);
      });
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased  text-black">
        <div className="fixed w-full flex items-center justify-between h-14 text-white z-[1000]">
          <div className="flex items-center justify-start md:justify-center gap-5 pl-3 w-14 md:w-64 h-14 bg-gray-800 border-none">
            <div>
              <Link to="/">
                <img src={logo} alt="logo" width={60} />
              </Link>
            </div>
            <span className="hidden md:block font-bold">EROBOT</span>
          </div>

          <div className="flex justify-end items-center gap-5 h-14 bg-gray-800  header-right w-full px-5">
            {/* dark mode and light mode  */}
            <ToggleLightDarkMode />

            {/* logout */}
            <div className="flex items-center gap-2 text-yellow-500">
              <span className="hidden sm:block text-white">Login as: </span>
              {userName}
            </div>

            {/* <Link to="/logout"> */}
            <button
              onClick={signUserOut}
              className="flex justify-center gap-2 items-center bg-red-600 hover:bg-red-700  p-1 px-3 rounded font-bold"
            >
              <HiOutlineLogout />{" "}
              <span className="hidden md:block">Logout</span>
            </button>
            {/* </Link> */}
          </div>
        </div>

        <div
          className="fixed flex flex-col top-14 left-0 w-14 hover:w-64 md:w-64 bg-gray-900 h-full text-white transition-all duration-300 border-none z-[900] sidebar"
          id="sidebar"
        >
          <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              <li className="px-5 hidden md:block">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
                    Main
                  </div>
                </div>
              </li>

              {/* dashboad */}
              <li
                className={activeTab === "dashboard" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("dashboard")}
              >
                <Link
                  to="/"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <RxDashboard />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Dashboard
                  </span>
                </Link>
              </li>

              {/* order */}
              <li
                className={activeTab === "order" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("order")}
              >
                <Link
                  to="/order"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaShoppingBasket />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate flex items-center gap-3">
                    Orders
                    {countNewOrder > 0 && (
                      <span className="p-3 py-1 rounded bg-green-500/20 text-green-500 border-green-600 border text-xs">
                        <>Today: +{countNewOrder}</>
                      </span>
                    )}
                  </span>
                </Link>
              </li>

              {/* product */}
              <li
                className={activeTab === "product" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("product")}
              >
                <Link
                  to="/product"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <TiShoppingCart />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Products
                  </span>
                </Link>
              </li>

              {/* product category */}
              <li
                className={
                  activeTab === "productCategory" ? "bg-gray-800" : " "
                }
                onClick={() => handleChangeTab("productCategory")}
              >
                <Link
                  to="/productCategory"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <BiCategoryAlt />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Product category
                  </span>
                </Link>
              </li>

              {/* blog */}
              <li
                className={activeTab === "blog" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("blog")}
              >
                <Link
                  to="/blog"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaBlog />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Article
                  </span>
                </Link>
              </li>

              {/* blog category */}
              <li
                className={activeTab === "blogCategory" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("blogCategory")}
              >
                <Link
                  to="/blogCategory"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <BiCategoryAlt />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Article category
                  </span>
                </Link>
              </li>

              {/* project */}
              <li
                className={activeTab === "project" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("project")}
              >
                <Link
                  to="/project"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaProjectDiagram />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Project
                  </span>
                </Link>
              </li>

              {/* author */}
              <li
                className={activeTab === "author" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("author")}
              >
                <Link
                  to="/author"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FiUsers />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Authors
                  </span>
                </Link>
              </li>

              {/* member */}
              <li
                className={activeTab === "member" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("member")}
              >
                <Link
                  to="/member"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FiUsers />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Members
                  </span>
                </Link>
              </li>
              {/* donors */}
              <li
                className={activeTab === "donor" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("donor")}
              >
                <Link
                  to="/donor"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FiUsers />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Donors
                  </span>
                </Link>
              </li>
              {/* award */}
              <li
                className={activeTab === "award" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("award")}
              >
                <Link
                  to="/award"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaAward />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Awards
                  </span>
                </Link>
              </li>

              {/* partner */}
              <li
                className={activeTab === "partner" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("partner")}
              >
                <Link
                  to="/partner"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FaSteamSymbol />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Partners
                  </span>
                </Link>
              </li>

              {/* sticker */}
              <li
                className={activeTab === "sticker" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("sticker")}
              >
                <Link
                  to="/sticker"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <PiImage />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Sticker
                  </span>
                </Link>
              </li>

              {/* contact data  */}

              <li
                className={activeTab === "contact" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("contact")}
              >
                <Link
                  to="/contact"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FiMail />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Contact
                  </span>
                </Link>
              </li>

              {/* admin */}

              <li
                className={activeTab === "admin" ? "bg-gray-800" : " "}
                onClick={() => handleChangeTab("admin")}
              >
                <Link
                  to="/admin"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <FiUser />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Admin
                  </span>
                </Link>
              </li>
            </ul>
            <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">
              Copyright @sorakhmer 2024
            </p>
          </div>
        </div>

        <div className="h-full ml-14 mt-14 mb-10 md:ml-64 p-2 md:p-4 lg:p-10 pt-5 relative ">
          {props.children}

          {/* update ,create and delete successfully notification */}
          {showNotification.status && (
            <Notification
              text={`${showNotification.item} ${showNotification.action} successfully`}
              bg="bg-green-600"
            />
          )}
        </div>
      </div>
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node,
};
export default Layout;
