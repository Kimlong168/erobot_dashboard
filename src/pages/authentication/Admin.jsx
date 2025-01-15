import Layout from "../../layouts/Layout";
import TableHead from "../../components/TableHead";
import Toast from "../../utils/Toast";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useState } from "react";

import LoadingInTable from "../../components/LoadingInTable";
import { AuthContext } from "../../contexts/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { UpdateContext } from "../../contexts/UpdateContext";
import { doc, setDoc } from "firebase/firestore";
import { FiEdit, FiXSquare } from "react-icons/fi";
import { DataContext } from "../../contexts/DataContext";

const Admin = () => {
  const { adminList, setShowNotification } = useContext(DataContext);
  const { userEmail } = useContext(AuthContext);
  const { setIsUpdated } = useContext(UpdateContext);
  const [newUsername, setNewUsername] = useState("");
  const [isEditing, setIsEditing] = useState({
    open: false,
    id: null,
  });

  // continue url after verify email

  const handleResetPassword = (email) => {
    const confirm = window.confirm(
      "Are you sure you want to reset password for this email"
    );
    if (confirm) {
      var actionCodeSettings = {
        url: "https://erobot-dashboard.vercel.app",
        handleCodeInApp: true,
      };
      sendPasswordResetEmail(auth, email, actionCodeSettings)
        .then(() => {
          // Password reset email sent!
          alert("Password reset email sent!");
        })
        .catch((error) => {
          console.log(error);
          alert("something went wrong");
          // ..
        });
    }
  };

  async function updateUsername(adminID, email, uid, creationTime) {
    if (newUsername.trim().length < 3) {
      alert("username must be at least 3 characters");
      return;
    }

    const docRef = doc(db, "admin", adminID);
    await setDoc(
      docRef,
      {
        displayName: newUsername,
        email: email,
        uid: uid,
        creationTime: creationTime,
      },
      { merge: true }
    );
    setIsEditing({
      open: false,
      id: null,
    });

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "admin",
      action: "updated",
    });

    console.log("username updated");
  }

  const UpdateUsernameForm = (adminID, email, uid, creationTime) => {
    return (
      <>
        <div className="flex">
          <input
            className="border px-2 py-1.5 text-gray-800 h-[40px] w-[180px] outline-none"
            name="newUsername"
            onChange={(e) => setNewUsername(e.target.value)}
            type="text"
            value={newUsername}
            placeholder="new username"
          />
          <button
            className="bg-green-600 text-white px-2 py-1.5 h-[40px]"
            onClick={(e) => {
              e.preventDefault();
              updateUsername(adminID, email, uid, creationTime);
            }}
          >
            Submit
          </button>
        </div>
      </>
    );
  };
  return (
    <Layout>
      <TableHead
        color="rgb(249,115,22)"
        title={`Admin (${adminList.length})`}
        border="border-orange-600 text-orange-500"
        link="/createAdmin"
      />

      <mark className="my-4 block p-2 bg-yellow-500 rounded font-semibold">
        You logged in with: {userEmail}
      </mark>

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                {/* <th className="px-4 py-3">UID</th> */}
                <th className="px-4 py-3">Creation Time</th>
                <th className="px-4 py-3">Reset Password</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {adminList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 font-bold text-white" colSpan={9}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}

              {adminList.map((item, index) => (
                <tr
                  key={item.id}
                  className={
                    " dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400" +
                    (item.email === userEmail
                      ? " bg-gray-400 hover:bg-gray-500 dark:bg-yellow-900 dark:text-white"
                      : "")
                  }
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3 cursor-pointer mb-1">
                      {item.displayName}
                      <span
                        onClick={() => {
                          setNewUsername("");
                          setIsEditing((prev) => ({
                            open: !prev.open,
                            id: item.id,
                          }));
                        }}
                      >
                        {isEditing.open && isEditing.id === item.id ? (
                          <FiXSquare />
                        ) : (
                          <FiEdit />
                        )}
                      </span>
                    </span>

                    {isEditing.open && isEditing.id === item.id
                      ? UpdateUsernameForm(
                          item.id,
                          item.email,
                          item.uid,
                          item.creationTime
                        )
                      : null}
                  </td>
                  <td className="px-4 py-3">{item.email}</td>
                  {/* <td className="px-4 py-3">{item.uid}</td> */}
                  <td className="px-4 py-3">{item.creationTime}</td>

                  <td className="px-4 py-3 text-sm text-red-600">
                    {item.email === userEmail ? (
                      <button
                        onClick={() => handleResetPassword(item.email)}
                        className="px-4 py-1.5 rounded bg-green-600 text-white"
                      >
                        Reset
                      </button>
                    ) : (
                      "Unauthorized"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"></div>
      </div>

      {/* Toast alert */}
      <Toast />
    </Layout>
  );
};

export default Admin;
