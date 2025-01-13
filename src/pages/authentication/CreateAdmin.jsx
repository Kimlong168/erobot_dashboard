import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useContext, useState } from "react";
import notify from "../../utils/Notify";
import ButtonBack from "../../components/ButtonBack";
import Toast from "../../utils/Toast";
import RedStar from "../../components/RedStar";
import Layout from "../../layouts/Layout";
import { auth, db } from "../../firebase-config";
import validatePassword from "../../utils/validatePassword";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { addDoc, collection } from "firebase/firestore";
import { UpdateContext } from "../../contexts/UpdateContext";
import { DataContext } from "../../contexts/DataContext";
const CreateUser = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCfPassword, setShowCfPassword] = useState(false);
  let navigate = useNavigate();

  // handle input change
  const handleOnChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // continue url after verify email
  var actionCodeSettings = {
    url: "https://sorakhmer-backend.netlify.app",
    handleCodeInApp: true,
  };

  const createNewUser = () => {
    // validate password match
    if (user.password !== user.confirmPassword) {
      alert("password not match");
      setUser({
        ...user,
        password: "",
        confirmPassword: "",
      });
      return;
    }

    // validate password length
    if (!validatePassword(user.password)) {
      alert("password must be at least 6 characters");
      setUser({
        ...user,
        password: "",
        confirmPassword: "",
      });
      return;
    }

    // Now perform user creation and sign-in
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        // Signed up
        navigate("/admin");
        setIsUpdated((prev) => !prev);
        const newUser = userCredential.user;

        // Create admin
        createAdmin(newUser.uid, newUser.metadata.creationTime);

        // Send email verification
        sendEmailVerification(newUser, actionCodeSettings)
          .then(() => {
            alert("Email verification sent. Check your email to verify.");
            // show create success notification
            setShowNotification({
              status: true,
              item: "admin",
              action: "created",
            });
          })
          .catch((error) => {
            console.log(error);
            alert("Something went wrong.");
          });

        // sign this user out bcoz it auto sign in after create user
        // signOut(auth)
        //   .then(() => {
        //     // Sign-out successful.
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });

        console.log("User created", newUser);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("Email already in use. Please try another email.");
        } else {
          alert(error.message);
        }
      });
  };

  // store admin to firestore
  const postCollectionRef = collection(db, "admin");

  const createAdmin = (uid, creationTime) => {
    addDoc(postCollectionRef, {
      uid: uid,
      displayName: user.displayName,
      email: user.email,
      isVerified: false,
      creationTime: creationTime,
    });
  };

  // sign user out function
  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-orange-500 underline uppercase">
          Create Admin
        </div>
        <small className="text-sm text-center text-gray-500 block">
          Once you create an admin, you cannot delete the admin.
        </small>
        <br />

        {/* create author categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* fullname input */}
            <label className="font-bold text-xl">
              Username
              <RedStar />
            </label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="displayName"
              placeholder="Username"
              value={user.displayName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* position input */}
            <label className="font-bold text-xl">
              Email
              <RedStar />
            </label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => handleOnChange(e)}
            />

            {/* password */}
            <label className="font-bold text-xl">
              Password
              <RedStar />
            </label>
            <div className="border border-gray-700 py-2 pr-2 rounded w-full outline-none mb-5 flex items-center">
              <input
                className="pl-2 w-full outline-none border-none cursor-text"
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={(e) => handleOnChange(e)}
                placeholder="Password"
              />
              {showPassword ? (
                <span
                  className="cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <FiEye />
                </span>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <FiEyeOff />
                </span>
              )}
            </div>

            {/*confirm password */}
            <label className="font-bold text-xl">
              Confirm Password
              <RedStar />
            </label>
            <div className="border border-gray-700 py-2 pr-2 rounded w-full outline-none mb-5 flex items-center">
              <input
                className="pl-2 w-full outline-none border-none cursor-text"
                type={showCfPassword ? "text" : "password"}
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={(e) => handleOnChange(e)}
                placeholder="Confirm Password"
              />
              {showCfPassword ? (
                <span
                  className="cursor-pointer"
                  onClick={() => setShowCfPassword((prev) => !prev)}
                >
                  <FiEye />
                </span>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => setShowCfPassword((prev) => !prev)}
                >
                  <FiEyeOff />
                </span>
              )}
            </div>

            <small className="text-sm text-red-600 mb-5">
              Password must be at least 6 characters .
            </small>

            {/* create author button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                user.email !== "" &&
                user.password !== "" &&
                user.displayName !== "" &&
                user.phoneNumber !== ""
                  ? createNewUser
                  : notify
              }
            >
              Create Admin
            </button>

            {/* toast alert */}
            <Toast />

            {/* button back */}
            <ButtonBack link="/admin" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateUser;
