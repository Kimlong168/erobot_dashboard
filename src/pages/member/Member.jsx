import { Link } from "react-router-dom";
import Layout from "../../layouts/Layout";
import TableHead from "../../components/TableHead";
import LinkIcon from "../../components/LinkIcon";
import { toast } from "react-toastify";
import Toast from "../../utils/Toast";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../../firebase-config";
import { deleteObject, ref } from "firebase/storage";
import { useContext, useState } from "react";
import { UpdateContext } from "../../contexts/UpdateContext";
import DeletingAlertBox from "../../components/DeletingAlertBox";
import deleteItemFucntion from "../../lib/deleteItemFunction";
import { toastProps } from "../../utils/toastProp";
import LoadingInTable from "../../components/LoadingInTable";
import PopupImage from "../../components/PopupImage";
import { DataContext } from "../../contexts/DataContext";

const Member = () => {
  const { memberList, setShowNotification } = useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);
  const [showImage, setShowImage] = useState({
    open: false,
    image: null,
  });
  // delete category notify
  const notifyDeleting = (id, memberImageId) => {
    toast.error(
      <>
        <DeletingAlertBox
          deleteItemFucntion={() => {
            deleteItemFucntion(id, "members")
              .then((result) => {
                // call delete image function
                if (result) {
                  deleteImageFromStorage(memberImageId);
                  setShowNotification({
                    status: true,
                    item: "member",
                    action: "deleted",
                  });
                }
              }) // This will log true if the item was deleted successfully
              .catch((error) => console.error(error));
          }}
          setIsUpdated={setIsUpdated}
        />
      </>,
      toastProps
    );
  };

  // delete image from firebase storage
  const deleteImageFromStorage = (memberImageId) => {
    // Create a reference to the image you want to delete
    const imageRef = ref(storage, `memberImages/${memberImageId}`);

    // Delete the old image
    deleteObject(imageRef)
      .then(() => {
        console.log("Member Image deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  return (
    <Layout>
      <TableHead
        color="rgb(59,130,246)"
        title={`Member (${memberList.length})`}
        border="border-blue-400 text-blue-400"
        link="/createMember"
      />

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Bio</th>
                <th className="px-4 py-3">Profile Image</th>
                <th className="px-4 py-3">Links</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {memberList.length == 0 && (
                <>
                  <tr className=" text-center">
                    <td className="py-8 font-bold text-white" colSpan={9}>
                      <LoadingInTable />
                    </td>
                  </tr>
                </>
              )}

              {memberList.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.fullName}</td>
                  <td className="px-4 py-3">{item.team}</td>
                  <td className="px-4 py-3">{item.position}</td>
                  <td className="px-4 py-3">
                    <div className="line-clamp-1 break-all  hover:line-clamp-none max-w-[300px] cursor-pointer transition-all transition-delay-300">
                      {item.bio}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <img
                      onClick={() =>
                        setShowImage({
                          open: true,
                          image: item.profilePicture,
                        })
                      }
                      className="w-[40px] h-[40px] rounded-full cursor-pointer"
                      src={item.profilePicture}
                      loading="lazy"
                    />

                    {showImage.open &&
                      showImage.image == item.profilePicture && (
                        <PopupImage
                          image={item.profilePicture}
                          setShowImage={(condition) => {
                            setShowImage({
                              image: item.profilePicture,
                              open: condition,
                            });
                            setShowImage({
                              image: null,
                              open: false,
                            });
                          }}
                        />
                      )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.links.length === 0 && <span>No Links</span>}
                      {item.links.map((link, index) => (
                        <span key={index}>
                          <LinkIcon url={link.link} title={link.title} />
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-center">
                    <Link to={`/updateMember/${item.id}`}>
                      <div className="px-2 py-1.5 rounded bg-green-600 text-white">
                        Edit
                      </div>
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-sm text-center cursor-pointer">
                    <div
                      onClick={() =>
                        notifyDeleting(item.id, item.memberImageId)
                      }
                      className="px-2 py-1.5 rounded bg-red-600 text-white"
                    >
                      Delete
                    </div>
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

export default Member;
