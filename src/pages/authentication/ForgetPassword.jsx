import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
const ForgetPassword = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //   let navigate = useNavigate();
  // continue url after verify email
  var actionCodeSettings = {
    url: "https://sorakhmer-admin.netlify.app/login",
    handleCodeInApp: true,
  };

  const handleForgetPassword = (e) => {
    e.preventDefault();
    if (!email) {
      alert("please fill email");
      return;
    }

    // set signingin to true to show loading
    setIsSubmitting(true);

    // send password reset email
    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(() => {
        // Password reset email sent!
        // alert("Password reset email sent! check your email");
        setIsEmailSent(true);
        // navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
        alert("something went wrong");
      });
  };

  if (isEmailSent) {
    return <CheckYourEmail />;
  }
  return (
    <div>
      <div className="m-4 sm:m-0">
        <div className="flex justify-center">
          <img className="w-[100px] sm:w-[200px]" src={logo} alt="logo" />
        </div>
        <div className="max-w-lg mx-auto mb-10 bg-white p-8 pt-0 rounded-xl shadow-xl shadow-slate-300">
          <h1 className="text-4xl font-bold text-center text-indigo-700">
            Reset password
          </h1>
          <p className="text-slate-500 text-center mt-1 text-sm">
            Fill up the form to reset the password
          </p>

          <form action="" className="my-10" onSubmit={handleForgetPassword}>
            <div className="flex flex-col space-y-5">
              <label>
                <p className="font-medium text-slate-700 pb-2">Email address</p>
                <input
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                  placeholder="Enter email address"
                />
              </label>

              <button
                type="submit"
                className="hover:-translate-y-1 transition-all duration-500 w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>

                <span className="flex items-center gap-3">
                  Reset password
                  {isSubmitting && (
                    <div
                      style={{ borderTopColor: "transparent" }}
                      className="w-4 h-4 border-2 border-white rounded-full animate-spin"
                    ></div>
                  )}
                </span>
              </button>
              <p className="text-center">
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
                >
                  <span>or Login now </span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CheckYourEmail = () => {
  return (
    <div className=" h-screen">
      <div className="bg-white p-6  md:mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Email Sent successfully!
          </h3>
          <p className="text-gray-600 my-2">
            Check your email to reset your password
          </p>
          <p> Have a great day! </p>
          <div className="py-10 text-center">
            <Link
              to="/login"
              className="px-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
            >
              GO BACK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
